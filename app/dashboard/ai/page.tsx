import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AIChatPage from "@/components/dashboard/ai-page";

export default async function AIPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [brands, collaborations, payments] = await Promise.all([
    userId
      ? prisma.brand.findMany({
          where: { userId },
          select: { name: true, status: true, contact: true, email: true },
        })
      : [],
    userId
      ? prisma.collaboration.findMany({
          where: { userId },
          select: {
            platform: true,
            status: true,
            amount: true,
            deliverables: true,
            deadline: true,
            brand: { select: { name: true } },
          },
        })
      : [],
    userId
      ? prisma.payment.findMany({
          where: { userId },
          select: {
            amount: true,
            status: true,
            dueDate: true,
            paidDate: true,
            brand: { select: { name: true } },
          },
        })
      : [],
  ]);

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  const summary = {
    brandsCount: brands.length,
    brandsList: brands.map((b) => `${b.name} (${b.status})`).join(", ") || "aucune",
    collabsCount: collaborations.length,
    collabsList:
      collaborations
        .map((c) => `${c.brand.name} - ${c.platform} - ${c.status} - ${c.amount}\u20AC`)
        .join("; ") || "aucune",
    totalRevenue,
    pendingCount: payments.filter((p) => p.status === "pending").length,
    pendingAmount: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    overdueCount: payments.filter(
      (p) => p.status === "overdue" || (p.status === "pending" && p.dueDate && new Date(p.dueDate) < new Date())
    ).length,
    deadlines: collaborations
      .filter((c) => c.deadline && new Date(c.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5)
      .map((c) => `${c.brand.name} le ${new Date(c.deadline!).toLocaleDateString("fr-FR")}`)
      .join(", ") || "aucune",
    userName: session?.user?.name || "Cr\u00E9ateur",
  };

  return <AIChatPage summary={summary} />;
}
