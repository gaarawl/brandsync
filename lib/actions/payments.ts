"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { sendNewPaymentEmail, sendPaymentReceivedEmail } from "@/lib/email";

export async function getPayments() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return unstable_cache(
    async () =>
      prisma.payment.findMany({
        where: { userId: session!.user!.id },
        include: { brand: true, collaboration: true },
        orderBy: { createdAt: "desc" },
      }),
    [`payments-${session.user.id}`],
    { revalidate: 120, tags: ["payments"] }
  )();
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

  const payment = await prisma.payment.create({
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
    include: { brand: true },
  });

  // Send email notification (non-blocking)
  if (session.user.email) {
    sendNewPaymentEmail(session.user.email, {
      brandName: payment.brand.name,
      amount: payment.amount,
      dueDate: payment.dueDate
        ? payment.dueDate.toLocaleDateString("fr-FR")
        : null,
    }).catch((e) => console.error("Email error:", e));
  }

  revalidateTag("payments");
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

  // Get old status before update
  const old = await prisma.payment.findUnique({
    where: { id, userId: session.user.id },
    include: { brand: true },
  });

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

  // Send email when payment marked as paid
  if (old && old.status !== "paid" && status === "paid" && session.user.email) {
    sendPaymentReceivedEmail(session.user.email, {
      brandName: old.brand.name,
      amount,
    }).catch((e) => console.error("Email error:", e));
  }

  revalidateTag("payments");
  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard");
}

export async function deletePayment(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.payment.delete({
    where: { id, userId: session.user.id },
  });

  revalidateTag("payments");
  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard");
}
