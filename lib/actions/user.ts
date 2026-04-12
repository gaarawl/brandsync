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

export async function updateMediaKit(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const website = formData.get("website") as string;
  const instagram = formData.get("instagram") as string;
  const tiktok = formData.get("tiktok") as string;
  const youtube = formData.get("youtube") as string;
  const twitter = formData.get("twitter") as string;
  const linkedin = formData.get("linkedin") as string;
  const rates = formData.get("rates") as string;
  const mediaKitPublic = formData.get("mediaKitPublic") === "true";

  if (!slug) throw new Error("Le slug est requis");

  // Check slug uniqueness
  const existing = await prisma.user.findUnique({ where: { slug } });
  if (existing && existing.id !== session.user.id) {
    throw new Error("Ce lien est déjà pris, choisis-en un autre");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      slug,
      bio: bio || null,
      location: location || null,
      website: website || null,
      instagram: instagram || null,
      tiktok: tiktok || null,
      youtube: youtube || null,
      twitter: twitter || null,
      linkedin: linkedin || null,
      rates: rates || null,
      mediaKitPublic,
    },
  });

  revalidatePath("/dashboard/media-kit");
  revalidatePath(`/kit/${slug}`);
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  revalidatePath("/");
}
