"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getLinks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { position: "asc" },
  });
}

export async function createLink(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const emoji = (formData.get("emoji") as string) || null;

  if (!title || !url) throw new Error("Titre et URL requis");

  const maxPosition = await prisma.link.aggregate({
    where: { userId: session.user.id },
    _max: { position: true },
  });

  await prisma.link.create({
    data: {
      title,
      url,
      emoji,
      position: (maxPosition._max.position ?? -1) + 1,
      userId: session.user.id,
    },
  });

  revalidateTag("links");
  revalidatePath("/dashboard/media-kit");
}

export async function updateLink(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const emoji = (formData.get("emoji") as string) || null;
  const active = formData.get("active") === "true";

  await prisma.link.update({
    where: { id, userId: session.user.id },
    data: { title, url, emoji, active },
  });

  revalidateTag("links");
  revalidatePath("/dashboard/media-kit");
}

export async function deleteLink(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.link.delete({
    where: { id, userId: session.user.id },
  });

  revalidateTag("links");
  revalidatePath("/dashboard/media-kit");
}

export async function reorderLinks(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.link.update({
        where: { id, userId: session!.user!.id },
        data: { position: index },
      })
    )
  );

  revalidateTag("links");
  revalidatePath("/dashboard/media-kit");
}
