"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCollaborations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.collaboration.findMany({
    where: { userId: session.user.id },
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });
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

  await prisma.collaboration.create({
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
  });

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

  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
}

export async function deleteCollaboration(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.collaboration.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/collaborations");
  revalidatePath("/dashboard");
}
