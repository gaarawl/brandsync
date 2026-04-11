"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.payment.findMany({
    where: { userId: session.user.id },
    include: { brand: true, collaboration: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPayment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const brandId = formData.get("brandId") as string;
  const collaborationId = (formData.get("collaborationId") as string) || null;
  const amount = parseInt(formData.get("amount") as string) || 0;
  const status = (formData.get("status") as string) || "pending";
  const invoiceDate = formData.get("invoiceDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const paidDate = formData.get("paidDate") as string;

  if (!brandId || !amount) throw new Error("Champs requis manquants");

  await prisma.payment.create({
    data: {
      amount,
      status,
      invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      paidDate: paidDate ? new Date(paidDate) : null,
      userId: session.user.id,
      brandId,
      collaborationId,
    },
  });

  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard");
}

export async function updatePayment(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const amount = parseInt(formData.get("amount") as string) || 0;
  const status = (formData.get("status") as string) || "pending";
  const invoiceDate = formData.get("invoiceDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const paidDate = formData.get("paidDate") as string;

  await prisma.payment.update({
    where: { id, userId: session.user.id },
    data: {
      amount,
      status,
      invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      paidDate: paidDate ? new Date(paidDate) : null,
    },
  });

  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard");
}

export async function deletePayment(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.payment.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard");
}
