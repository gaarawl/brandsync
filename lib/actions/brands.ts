"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export async function getBrands() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return unstable_cache(
    async () =>
      prisma.brand.findMany({
        where: { userId: session!.user!.id },
        include: {
          _count: { select: { collaborations: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    [`brands-${session.user.id}`],
    { revalidate: 120, tags: ["brands"] }
  )();
}

export async function createBrand(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const email = formData.get("email") as string;
  const notes = formData.get("notes") as string;
  const paymentDelay = formData.get("paymentDelay") as string;

  if (!name) throw new Error("Le nom est requis");

  await prisma.brand.create({
    data: {
      name,
      contact: contact || null,
      email: email || null,
      notes: notes || null,
      paymentDelay: paymentDelay || null,
      userId: session.user.id,
    },
  });

  revalidateTag("brands");
  revalidatePath("/dashboard/marques");
  revalidatePath("/dashboard");
}

export async function updateBrand(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const email = formData.get("email") as string;
  const notes = formData.get("notes") as string;
  const paymentDelay = formData.get("paymentDelay") as string;
  const status = formData.get("status") as string;

  await prisma.brand.update({
    where: { id, userId: session.user.id },
    data: {
      name,
      contact: contact || null,
      email: email || null,
      notes: notes || null,
      paymentDelay: paymentDelay || null,
      status: status || "Actif",
    },
  });

  revalidateTag("brands");
  revalidatePath("/dashboard/marques");
  revalidatePath("/dashboard");
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.brand.delete({
    where: { id, userId: session.user.id },
  });

  revalidateTag("brands");
  revalidatePath("/dashboard/marques");
  revalidatePath("/dashboard");
}
