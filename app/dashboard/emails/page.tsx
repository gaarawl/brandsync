import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EmailsPage from "@/components/dashboard/emails-page";

const PLAN_LIMITS = {
  free: { dailyEmails: 5, maxRecipients: 3 },
  pro: { dailyEmails: 50, maxRecipients: 10 },
} as const;

export default async function EmailsDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [contacts, campaigns, brands, user, sentToday] = await Promise.all([
    userId
      ? prisma.contact.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : [],
    userId
      ? prisma.emailCampaign.findMany({
          where: { userId },
          include: {
            recipients: { select: { id: true, status: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : [],
    userId
      ? prisma.brand.findMany({
          where: { userId },
          select: { id: true, name: true, email: true, contact: true },
        })
      : [],
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { plan: true },
        })
      : null,
    userId
      ? prisma.emailRecipient.count({
          where: {
            campaign: { userId },
            status: "sent",
            sentAt: { gte: todayStart },
          },
        })
      : 0,
  ]);

  const plan = (user?.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return (
    <EmailsPage
      contacts={contacts}
      campaigns={campaigns}
      brands={brands}
      userName={session?.user?.name || "Créateur"}
      usage={{
        sentToday,
        dailyLimit: limits.dailyEmails,
        maxRecipients: limits.maxRecipients,
        plan,
      }}
    />
  );
}
