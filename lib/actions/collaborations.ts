"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { sendNewCollabEmail, sendCollabStatusEmail } from "@/lib/email";

export async function getCollaborations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return unstable_cache(
    async () =>
      prisma.collaboration.findMany({
        where: { userId: session!.user!.id },
        include: { brand: true },
        orderBy: { createdAt: "desc" },
      }),
    [`collabs-${session.user.id}`],
    { revalidate: 120, tags: ["collaborations"] }
  )();
}

export async function createCollaboration(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const brandId = formData.get("brandId") as string;
  const platform = formData.get("platform") as string;
  const deliverables = formData.get("deliverables") as string;
  const status = formData.get("status") as string;
  const amount = parseInt(formData.get("amount") as string) || 0;
  const deadline = formData.get("deadline") as string;
  const notes = formData.get("notes") as string;

  if (!brandId || !platform || !deliverables) {
    throw new Error("Champs requis manquants");
  }

  const collab = await prisma.collaboration.create({
    data: {
      platform,
      deliverables,
      status: status || "lead",
      amount,
      deadline: deadline ? new Date(deadline) : null,
      notes: notes || null,
      userId: session.user.id,
      brandId,
    },
    include: { brand: true },
  });

  // Send email notification (non-blocking)
  if (session.user.email) {
    sendNewCollabEmail(session.user.email, {
      brandName: collab.brand.name,
      platform: collab.platform,
      amount: collab.amount,
    }).catch((e) => console.error("Email error:", e));
  }

  revalidateTag("collaborations");
  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
}

export async function updateCollaboration(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const platform = formData.get("platform") as string;
  const deliverables = formData.get("deliverables") as string;
  const status = formData.get("status") as string;
  const amount = parseInt(formData.get("amount") as string) || 0;
  const deadline = formData.get("deadline") as string;
  const notes = formData.get("notes") as string;

  // Get old status before update
  const old = await prisma.collaboration.findUnique({
    where: { id, userId: session.user.id },
    include: { brand: true },
  });

  await prisma.collaboration.update({
    where: { id, userId: session.user.id },
    data: {
      platform,
      deliverables,
      status,
      amount,
      deadline: deadline ? new Date(deadline) : null,
      notes: notes || null,
    },
  });

  // Send email if status changed
  if (old && old.status !== status && session.user.email) {
    sendCollabStatusEmail(session.user.email, {
      brandName: old.brand.name,
      oldStatus: old.status,
      newStatus: status,
    }).catch((e) => console.error("Email error:", e));
  }

  revalidateTag("collaborations");
  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
}

export async function deleteCollaboration(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.collaboration.delete({
    where: { id, userId: session.user.id },
  });

  revalidateTag("collaborations");
  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
}
