"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendCampaignEmail } from "@/lib/email";

// ── Limites par plan ───────────────────────────────────────────────

const PLAN_LIMITS = {
  free: { dailyEmails: 5, maxRecipients: 3 },
  pro: { dailyEmails: 50, maxRecipients: 10 },
} as const;

export async function getEmailUsage() {
  const session = await auth();
  if (!session?.user?.id) return { sentToday: 0, limit: 5, maxRecipients: 3, plan: "free" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const plan = (user?.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sentToday = await prisma.emailRecipient.count({
    where: {
      campaign: { userId: session.user.id },
      status: "sent",
      sentAt: { gte: todayStart },
    },
  });

  return {
    sentToday,
    limit: limits.dailyEmails,
    maxRecipients: limits.maxRecipients,
    plan,
  };
}

// ── Contacts ───────────────────────────────────────────────────────

export async function getContacts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.contact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createContact(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const company = (formData.get("company") as string)?.trim() || null;
  const tags = (formData.get("tags") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!name || !email) throw new Error("Nom et email requis");

  const existing = await prisma.contact.findUnique({
    where: { userId_email: { userId: session.user.id, email } },
  });
  if (existing) throw new Error("Ce contact existe déjà");

  await prisma.contact.create({
    data: { name, email, company, tags, notes, userId: session.user.id },
  });

  revalidatePath("/dashboard/emails");
}

export async function updateContact(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const company = (formData.get("company") as string)?.trim() || null;
  const tags = (formData.get("tags") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!name || !email) throw new Error("Nom et email requis");

  await prisma.contact.update({
    where: { id, userId: session.user.id },
    data: { name, email, company, tags, notes },
  });

  revalidatePath("/dashboard/emails");
}

export async function deleteContact(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.contact.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/emails");
}

// ── Campagnes ──────────────────────────────────────────────────────

export async function getCampaigns() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.emailCampaign.findMany({
    where: { userId: session.user.id },
    include: {
      recipients: { select: { id: true, status: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCampaign(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const subject = (formData.get("subject") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const recipientIds = JSON.parse(
    (formData.get("recipientIds") as string) || "[]"
  ) as string[];

  if (!subject || !body) throw new Error("Sujet et contenu requis");
  if (recipientIds.length === 0)
    throw new Error("Sélectionne au moins un destinataire");

  // Check recipient limit
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = (user?.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  if (recipientIds.length > limits.maxRecipients) {
    throw new Error(
      `Maximum ${limits.maxRecipients} destinataire(s) par campagne (plan ${plan})`
    );
  }

  const contacts = await prisma.contact.findMany({
    where: { id: { in: recipientIds }, userId: session.user.id },
    select: { id: true, email: true },
  });

  const campaign = await prisma.emailCampaign.create({
    data: {
      subject,
      body,
      userId: session.user.id,
      recipients: {
        create: contacts.map((c) => ({
          email: c.email,
          contactId: c.id,
        })),
      },
    },
  });

  revalidatePath("/dashboard/emails");
  return campaign.id;
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const subject = (formData.get("subject") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const recipientIds = JSON.parse(
    (formData.get("recipientIds") as string) || "[]"
  ) as string[];

  if (!subject || !body) throw new Error("Sujet et contenu requis");

  // Check recipient limit
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = (user?.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  if (recipientIds.length > limits.maxRecipients) {
    throw new Error(
      `Maximum ${limits.maxRecipients} destinataire(s) par campagne (plan ${plan})`
    );
  }

  const contacts = await prisma.contact.findMany({
    where: { id: { in: recipientIds }, userId: session.user.id },
    select: { id: true, email: true },
  });

  await prisma.emailRecipient.deleteMany({ where: { campaignId: id } });

  await prisma.emailCampaign.update({
    where: { id, userId: session.user.id },
    data: {
      subject,
      body,
      recipients: {
        create: contacts.map((c) => ({
          email: c.email,
          contactId: c.id,
        })),
      },
    },
  });

  revalidatePath("/dashboard/emails");
}

export async function deleteCampaign(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.emailCampaign.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/emails");
}

export async function sendCampaign(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  // Check daily limit
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const plan = (user?.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sentToday = await prisma.emailRecipient.count({
    where: {
      campaign: { userId: session.user.id },
      status: "sent",
      sentAt: { gte: todayStart },
    },
  });

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id, userId: session.user.id },
    include: { recipients: true },
  });

  if (!campaign) throw new Error("Campagne introuvable");
  if (campaign.status === "sent") throw new Error("Campagne déjà envoyée");
  if (campaign.recipients.length === 0)
    throw new Error("Aucun destinataire");

  const remaining = limits.dailyEmails - sentToday;
  if (remaining <= 0) {
    throw new Error(
      `Limite atteinte : ${limits.dailyEmails} emails/jour (plan ${plan}). Reviens demain ou passe au Pro !`
    );
  }
  if (campaign.recipients.length > remaining) {
    throw new Error(
      `Il te reste ${remaining} email(s) aujourd'hui mais cette campagne a ${campaign.recipients.length} destinataire(s)`
    );
  }

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const recipient of campaign.recipients) {
    try {
      const result = await sendCampaignEmail(recipient.email, {
        subject: campaign.subject,
        body: campaign.body,
        userName: session.user.name || "Un créateur",
      });

      // Resend returns { data, error } — check for errors
      if (result && typeof result === "object" && "error" in result && result.error) {
        throw new Error(
          typeof result.error === "object" && result.error !== null && "message" in result.error
            ? (result.error as { message: string }).message
            : "Erreur Resend"
        );
      }

      await prisma.emailRecipient.update({
        where: { id: recipient.id },
        data: { status: "sent", sentAt: new Date() },
      });
      sentCount++;
    } catch (e: any) {
      const errMsg = e?.message || "Erreur inconnue";
      console.error(`Email failed for ${recipient.email}:`, errMsg);
      errors.push(`${recipient.email}: ${errMsg}`);
      await prisma.emailRecipient.update({
        where: { id: recipient.id },
        data: { status: "failed" },
      });
      failedCount++;
    }
  }

  await prisma.emailCampaign.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });

  revalidatePath("/dashboard/emails");
  revalidatePath("/dashboard");

  return { sentCount, failedCount, errors };
}
