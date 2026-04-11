"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = formData.get("name") as string;
  if (!name) throw new Error("Le nom est requis");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  revalidatePath("/");
}
