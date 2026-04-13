import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getCollaborations } from "@/lib/actions/collaborations";
import { getPayments } from "@/lib/actions/payments";
import { getBrands } from "@/lib/actions/brands";
import Topbar from "@/components/dashboard/topbar";

const getUserPlan = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    return user?.plan || "free";
  },
  ["user-plan"],
  { revalidate: 300, tags: ["user-plan"] }
);
import StatsGrid from "@/components/dashboard/stats-grid";
import RevenueChart from "@/components/dashboard/revenue-chart";
import CollabsList from "@/components/dashboard/collabs-list";
import CalendarWidget from "@/components/dashboard/calendar-widget";
import PaymentsWidget from "@/components/dashboard/payments-widget";
import ActivityFeed from "@/components/dashboard/activity-feed";

export default async function DashboardPage() {
  const session = await auth();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [collaborations, allPayments, brands, plan] = await Promise.all([
    getCollaborations(),
    getPayments(),
    getBrands(),
    session?.user?.id ? getUserPlan(session.user.id) : "free",
  ]);

  const emailsSent = 0;

  // ── Stats ──
  const activeCollabs = collaborations.filter((c) =>
    ["production", "validation", "negotiation"].includes(c.status)
  );
  const paidCollabs = collaborations.filter((c) => c.status === "paid");
  const totalRevenue = paidCollabs.reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = allPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  // Revenue growth: compare this month vs last month
  const thisMonthRevenue = allPayments
    .filter((p) => p.status === "paid" && p.paidDate && new Date(p.paidDate) >= thisMonthStart)
    .reduce((s, p) => s + p.amount, 0);
  const lastMonthRevenue = allPayments
    .filter(
      (p) =>
        p.status === "paid" &&
        p.paidDate &&
        new Date(p.paidDate) >= lastMonthStart &&
        new Date(p.paidDate) < thisMonthStart
    )
    .reduce((s, p) => s + p.amount, 0);
  const revenueGrowth =
    lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : thisMonthRevenue > 0
      ? 100
      : 0;

  // Upcoming deadlines
  const upcomingDeadlines = collaborations.filter(
    (c) =>
      c.deadline &&
      new Date(c.deadline) >= now &&
      ["production", "validation"].includes(c.status)
  );
  const nextDeadline = upcomingDeadlines.sort(
    (a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
  )[0];

  const stats = {
    revenue: totalRevenue,
    revenueGrowth,
    activeCollabs: activeCollabs.length,
    pendingAmount,
    upcomingCount: upcomingDeadlines.length,
    nextDeadline: nextDeadline?.deadline
      ? new Date(nextDeadline.deadline).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        })
      : null,
    brandsCount: brands.length,
    emailsSent,
  };

  // ── Revenue chart (6 months) ──
  const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const amount = allPayments
      .filter(
        (p) =>
          p.status === "paid" &&
          p.paidDate &&
          new Date(p.paidDate) >= d &&
          new Date(p.paidDate) <= monthEnd
      )
      .reduce((s, p) => s + p.amount, 0);
    return { label: monthLabels[d.getMonth()], amount };
  });

  // ── Recent collabs ──
  const recentCollabs = collaborations.slice(0, 5).map((c) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      lead: { label: "Nouveau lead", color: "bg-blue-500/15 text-blue-400" },
      negotiation: { label: "Négociation", color: "bg-orange-500/15 text-orange-400" },
      production: { label: "En production", color: "bg-green-500/15 text-green-400" },
      validation: { label: "En attente", color: "bg-yellow-500/15 text-yellow-400" },
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
        ? new Date(c.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
        : "—",
      amount: `${c.amount.toLocaleString("fr-FR")} €`,
      brandName: c.brand.name,
    };
  });

  // ── Calendar events ──
  const calendarEvents = upcomingDeadlines
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 4)
    .map((c) => {
      const d = new Date(c.deadline!);
      return {
        day: d.getDate().toString(),
        month: d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase(),
        label: c.deliverables,
        sub: c.brand.name,
      };
    });

  // ── Recent payments ──
  const recentPayments = allPayments.slice(0, 4).map((p) => ({
    id: p.id,
    brand: p.brand.name,
    amount: `+${p.amount.toLocaleString("fr-FR")} €`,
    status: p.status === "paid" ? "Payé" : p.status === "overdue" ? "En retard" : "En attente",
    statusColor:
      p.status === "paid"
        ? "text-green-400 bg-green-500/10"
        : p.status === "overdue"
        ? "text-red-400 bg-red-500/10"
        : "text-yellow-400 bg-yellow-500/10",
    brandName: p.brand.name,
  }));

  // ── Activity feed ──
  type ActivityItem = {
    id: string;
    type: "collab" | "payment" | "email" | "deadline";
    title: string;
    description: string;
    date: string;
    sortDate: Date;
    status: "success" | "warning" | "info";
  };

  const activities: ActivityItem[] = [];

  // Recent collaborations (last 10)
  for (const c of collaborations.slice(0, 10)) {
    const statusLabels: Record<string, string> = {
      lead: "Nouveau lead",
      negotiation: "Négociation en cours",
      production: "Production démarrée",
      validation: "En attente de validation",
      invoiced: "Facture envoyée",
      paid: "Collab payée",
    };
    activities.push({
      id: `collab-${c.id}`,
      type: "collab",
      title: `${c.brand.name} — ${statusLabels[c.status] || c.status}`,
      description: `${c.platform} · ${c.amount.toLocaleString("fr-FR")} €`,
      date: timeAgo(c.updatedAt),
      sortDate: c.updatedAt,
      status: c.status === "paid" ? "success" : c.status === "production" ? "info" : "info",
    });
  }

  // Recent payments
  for (const p of allPayments.slice(0, 10)) {
    if (p.status === "paid") {
      activities.push({
        id: `pay-${p.id}`,
        type: "payment",
        title: `Paiement reçu — ${p.brand.name}`,
        description: `+${p.amount.toLocaleString("fr-FR")} €`,
        date: timeAgo(p.paidDate || p.updatedAt),
        sortDate: p.paidDate || p.updatedAt,
        status: "success",
      });
    } else if (p.status === "overdue") {
      activities.push({
        id: `pay-${p.id}`,
        type: "payment",
        title: `Paiement en retard — ${p.brand.name}`,
        description: `${p.amount.toLocaleString("fr-FR")} €`,
        date: timeAgo(p.updatedAt),
        sortDate: p.updatedAt,
        status: "warning",
      });
    }
  }

  // Upcoming deadlines
  for (const c of upcomingDeadlines.slice(0, 5)) {
    const daysLeft = Math.ceil(
      (new Date(c.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    activities.push({
      id: `deadline-${c.id}`,
      type: "deadline",
      title: `Deadline — ${c.brand.name}`,
      description: `${c.deliverables} · dans ${daysLeft}j`,
      date: new Date(c.deadline!).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      sortDate: c.deadline!,
      status: daysLeft <= 3 ? "warning" : "info",
    });
  }

  // Sort by most recent and take top 8
  activities.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
  const feedActivities = activities.slice(0, 8).map(({ sortDate, ...a }) => a);

  // ── Notifications ──
  const notifications: {
    id: string;
    type: "deadline" | "overdue" | "upcoming";
    title: string;
    description: string;
    date: string;
  }[] = [];

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

  for (const p of allPayments) {
    if (p.status === "overdue") {
      notifications.push({
        id: `overdue-${p.id}`,
        type: "overdue",
        title: `Paiement en retard : ${p.brand.name}`,
        description: `${p.amount.toLocaleString("fr-FR")} €`,
        date: p.dueDate
          ? new Date(p.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
          : "",
      });
    }
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
      <Topbar userName={session?.user?.name} userPlan={plan} notifications={notifications} />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-radial-top">
        <StatsGrid stats={stats} />

        {/* Revenue chart + Activity feed */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart
              data={chartData}
              totalRevenue={totalRevenue}
              growth={revenueGrowth}
            />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed activities={feedActivities} />
          </div>
        </div>

        {/* Collabs + Calendar/Payments */}
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

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
