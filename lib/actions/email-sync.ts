"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPlanLimits } from "@/lib/plan-limits";
import { scanForCollabEmails, type DetectedCollab } from "@/lib/gmail";

export async function getEmailSyncStatus() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user, syncRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
    prisma.emailSync.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  const plan = user?.plan || "free";
  const limits = getPlanLimits(plan);

  return {
    enabled: syncRecord?.enabled || false,
    lastSyncAt: syncRecord?.lastSyncAt?.toISOString() || null,
    plan,
    canSync: limits.emailSync,
    syncIntervalMinutes: limits.syncIntervalMinutes,
  };
}

export async function enableEmailSync() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const limits = getPlanLimits(user?.plan || "free");
  if (!limits.emailSync) {
    throw new Error("Cette fonctionnalité nécessite un plan Pro ou Business");
  }

  // Check if Google account has the right tokens
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "google" },
    select: { access_token: true, refresh_token: true },
  });

  if (!account?.access_token) {
    throw new Error("Reconnecte ton compte Google pour activer la sync Gmail");
  }

  await prisma.emailSync.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, enabled: true },
    update: { enabled: true },
  });

  revalidatePath("/dashboard/emails");
}

export async function disableEmailSync() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.emailSync.updateMany({
    where: { userId: session.user.id },
    data: { enabled: false },
  });

  revalidatePath("/dashboard/emails");
}

export async function triggerManualSync(): Promise<{
  found: number;
  created: number;
  errors: string[];
}> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const limits = getPlanLimits(user?.plan || "free");
  if (!limits.emailSync) {
    throw new Error("Plan Pro ou Business requis");
  }

  // Check rate limit
  const syncRecord = await prisma.emailSync.findUnique({
    where: { userId: session.user.id },
  });

  if (syncRecord?.lastSyncAt) {
    const elapsed = Date.now() - syncRecord.lastSyncAt.getTime();
    const minInterval = limits.syncIntervalMinutes * 60 * 1000;
    if (elapsed < minInterval) {
      const waitMinutes = Math.ceil((minInterval - elapsed) / 60000);
      throw new Error(
        `Prochaine sync disponible dans ${waitMinutes} minute${waitMinutes > 1 ? "s" : ""}`
      );
    }
  }

  return processEmailSync(session.user.id);
}

/**
 * Core sync logic — used by both manual trigger and cron
 */
export async function processEmailSync(userId: string): Promise<{
  found: number;
  created: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let created = 0;

  try {
    const { emails, lastMessageId } = await scanForCollabEmails(userId);

    for (const email of emails) {
      try {
        await createCollabFromEmail(userId, email);
        created++;
      } catch (err: any) {
        if (!err.message?.includes("existe déjà")) {
          errors.push(`${email.fromName}: ${err.message}`);
        }
      }
    }

    // Update sync record
    await prisma.emailSync.upsert({
      where: { userId },
      create: { userId, enabled: true, lastSyncAt: new Date(), lastMessageId },
      update: { lastSyncAt: new Date(), lastMessageId },
    });

    revalidateTag("collaborations");
    revalidateTag("brands");
    revalidatePath("/dashboard/emails");
    revalidatePath("/dashboard/collaborations");

    return { found: emails.length, created, errors };
  } catch (err: any) {
    return { found: 0, created: 0, errors: [err.message] };
  }
}

/**
 * Create a brand and collaboration from a detected email
 */
async function createCollabFromEmail(userId: string, email: DetectedCollab) {
  // Check for duplicate (same sender email + similar subject)
  const existing = await prisma.collaboration.findFirst({
    where: {
      userId,
      notes: { contains: email.messageId },
    },
  });

  if (existing) {
    throw new Error("Cette collaboration existe déjà");
  }

  // Find or create brand from sender domain
  const brandName = email.fromDomain
    .replace(/\.(com|fr|io|co|net|org|agency|media|studio)$/i, "")
    .split(".")
    .pop()!
    .charAt(0)
    .toUpperCase() +
    email.fromDomain
      .replace(/\.(com|fr|io|co|net|org|agency|media|studio)$/i, "")
      .split(".")
      .pop()!
      .slice(1);

  let brand = await prisma.brand.findFirst({
    where: {
      userId,
      email: { contains: email.fromDomain },
    },
  });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: email.fromName || brandName,
        email: email.from,
        contact: email.fromName,
        notes: `Détecté automatiquement via Gmail`,
        userId,
      },
    });
  }

  // Create collaboration as lead
  await prisma.collaboration.create({
    data: {
      platform: "Email",
      deliverables: email.subject,
      status: "lead",
      amount: 0,
      notes: `📧 Détecté via Gmail Sync\n\nMessage ID: ${email.messageId}\nDe: ${email.from}\nSujet: ${email.subject}\nExtrait: ${email.snippet}\nMots-clés: ${email.matchedKeywords.join(", ")}`,
      userId,
      brandId: brand.id,
    },
  });
}
