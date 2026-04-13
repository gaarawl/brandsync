import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MediaKitPage from "@/components/dashboard/media-kit-page";

export default async function MediaKitDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: { collaborations: true, brands: true, payments: true },
          },
          payments: {
            where: { status: "paid" },
            select: { amount: true },
          },
          links: {
            orderBy: { position: "asc" },
          },
        },
      })
    : null;

  const totalRevenue =
    user?.payments.reduce((s, p) => s + p.amount, 0) || 0;

  return (
    <MediaKitPage
      data={{
        slug: user?.slug || null,
        bio: user?.bio || null,
        location: user?.location || null,
        website: user?.website || null,
        instagram: user?.instagram || null,
        tiktok: user?.tiktok || null,
        youtube: user?.youtube || null,
        twitter: user?.twitter || null,
        linkedin: user?.linkedin || null,
        rates: user?.rates || null,
        mediaKitPublic: user?.mediaKitPublic || false,
        name: user?.name || "",
        image: user?.image || null,
        stats: {
          collabs: user?._count.collaborations || 0,
          brands: user?._count.brands || 0,
          revenue: totalRevenue,
        },
        links: (user?.links || []).map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          emoji: l.emoji,
          position: l.position,
          active: l.active,
          clicks: l.clicks,
        })),
        pageViews: user?.pageViews || 0,
      }}
    />
  );
}
