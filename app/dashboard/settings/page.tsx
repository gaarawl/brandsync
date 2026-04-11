import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/dashboard/settings-page";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: { select: { provider: true } },
          _count: {
            select: { brands: true, collaborations: true, payments: true },
          },
        },
      })
    : null;

  return (
    <SettingsClient
      user={{
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || null,
        providers: user?.accounts.map((a) => a.provider) || [],
        createdAt: user?.createdAt?.toISOString() || "",
        stats: {
          brands: user?._count.brands || 0,
          collaborations: user?._count.collaborations || 0,
          payments: user?._count.payments || 0,
        },
      }}
    />
  );
}
