"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export async function getEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return unstable_cache(
    async () =>
      prisma.event.findMany({
        where: { userId: session!.user!.id },
        orderBy: { date: "asc" },
      }),
    [`events-${session.user.id}`],
    { revalidate: 120, tags: ["events"] }
  )();
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  if (!title || !date) throw new Error("Champs requis manquants");

  await prisma.event.create({
    data: {
      title,
      type: type || "Autre",
      date: new Date(date),
      notes: notes || null,
      userId: session.user.id,
    },
  });

  revalidateTag("events");
  revalidatePath("/dashboard/calendrier");
  revalidatePath("/dashboard");
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  await prisma.event.update({
    where: { id, userId: session.user.id },
    data: {
      title,
      type: type || "Autre",
      date: new Date(date),
      notes: notes || null,
    },
  });

  revalidateTag("events");
  revalidatePath("/dashboard/calendrier");
  revalidatePath("/dashboard");
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.event.delete({
    where: { id, userId: session.user.id },
  });

  revalidateTag("events");
  revalidatePath("/dashboard/calendrier");
  revalidatePath("/dashboard");
}
