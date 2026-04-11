import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Topbar from "@/components/dashboard/topbar";
import StatsGrid from "@/components/dashboard/stats-grid";
import CollabsList from "@/components/dashboard/collabs-list";
import CalendarWidget from "@/components/dashboard/calendar-widget";
import PaymentsWidget from "@/components/dashboard/payments-widget";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [collaborations, payments] = await Promise.all([
    userId
      ? prisma.collaboration.findMany({
          where: { userId },
          include: { brand: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
    userId
      ? prisma.payment.findMany({
          where: { userId },
          include: { brand: true },
          orderBy: { createdAt: "desc" },
          take: 4,
        })
      : [],
  ]);

  // Stats
  const activeCollabs = collaborations.filter((c) =>
    ["production", "validation", "negotiation"].includes(c.status)
  );
  const paidCollabs = collaborations.filter((c) => c.status === "paid");
  const totalRevenue = paidCollabs.reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const now = new Date();
  const upcomingDeadlines = collaborations.filter(
    (c) =>
      c.deadline &&
      new Date(c.deadline) >= now &&
      ["production", "validation"].includes(c.status)
  );
  const nextDeadline = upcomingDeadlines.sort(
    (a, b) =>
      new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
  )[0];

  const stats = {
    revenue: totalRevenue,
    activeCollabs: activeCollabs.length,
    pendingAmount,
    upcomingCount: upcomingDeadlines.length,
    nextDeadline: nextDeadline?.deadline
      ? new Date(nextDeadline.deadline).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        })
      : null,
  };

  // Recent collabs for widget
  const recentCollabs = collaborations.slice(0, 5).map((c) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      lead: { label: "Nouveau lead", color: "bg-blue-500/15 text-blue-400" },
      negotiation: {
        label: "Négociation",
        color: "bg-orange-500/15 text-orange-400",
      },
      production: {
        label: "En production",
        color: "bg-green-500/15 text-green-400",
      },
      validation: {
        label: "En attente",
        color: "bg-yellow-500/15 text-yellow-400",
      },
      invoiced: { label: "Facturée", color: "bg-accent/15 text-accent" },
      paid: { label: "Payé", color: "bg-emerald-500/15 text-emerald-400" },
    };
    const st = statusMap[c.status] || statusMap.lead;
    return {
      id: c.id,
      brand: c.brand.name,
      platform: `${c.platform} · ${c.deliverables}`,
      status: st.label,
      statusColor: st.color,
      date: c.deadline
        ? new Date(c.deadline).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })
        : "—",
      amount: `${c.amount.toLocaleString("fr-FR")} €`,
      brandName: c.brand.name,
    };
  });

  // Calendar events from collaboration deadlines
  const calendarEvents = upcomingDeadlines
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )
    .slice(0, 4)
    .map((c) => {
      const d = new Date(c.deadline!);
      return {
        day: d.getDate().toString(),
        month: d
          .toLocaleDateString("fr-FR", { month: "short" })
          .toUpperCase(),
        label: c.deliverables,
        sub: c.brand.name,
      };
    });

  // Payments for widget
  const recentPayments = payments.slice(0, 4).map((p) => ({
    id: p.id,
    brand: p.brand.name,
    amount: `+${p.amount.toLocaleString("fr-FR")} €`,
    status: p.status === "paid" ? "Payé" : "En attente",
    statusColor:
      p.status === "paid"
        ? "text-green-400 bg-green-500/10"
        : "text-yellow-400 bg-yellow-500/10",
    brandName: p.brand.name,
  }));

  // Notifications
  const notifications: {
    id: string;
    type: "deadline" | "overdue" | "upcoming";
    title: string;
    description: string;
    date: string;
  }[] = [];

  // Deadlines dans les 3 prochains jours
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  for (const c of collaborations) {
    if (
      c.deadline &&
      new Date(c.deadline) >= now &&
      new Date(c.deadline) <= threeDays &&
      ["production", "validation"].includes(c.status)
    ) {
      notifications.push({
        id: `deadline-${c.id}`,
        type: "deadline",
        title: `Deadline proche : ${c.brand.name}`,
        description: c.deliverables,
        date: new Date(c.deadline).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
      });
    }
  }

  // Paiements en retard
  for (const p of payments) {
    if (p.status === "overdue") {
      notifications.push({
        id: `overdue-${p.id}`,
        type: "overdue",
        title: `Paiement en retard : ${p.brand.name}`,
        description: `${p.amount.toLocaleString("fr-FR")} €`,
        date: p.dueDate
          ? new Date(p.dueDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })
          : "",
      });
    }
  }

  // Paiements en attente depuis longtemps (> 7 jours)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  for (const p of payments) {
    if (p.status === "pending" && p.dueDate && new Date(p.dueDate) < now) {
      notifications.push({
        id: `pending-${p.id}`,
        type: "overdue",
        title: `Paiement en attente dépassé : ${p.brand.name}`,
        description: `${p.amount.toLocaleString("fr-FR")} € — échéance dépassée`,
        date: new Date(p.dueDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        }),
      });
    }
  }

  return (
    <>
      <Topbar userName={session?.user?.name} notifications={notifications} />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <StatsGrid stats={stats} />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CollabsList collabs={recentCollabs} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <CalendarWidget events={calendarEvents} />
            <PaymentsWidget payments={recentPayments} />
          </div>
        </div>
      </main>
    </>
  );
}
