import { getCollaborations } from "@/lib/actions/collaborations";
import { getPayments } from "@/lib/actions/payments";
import { getBrands } from "@/lib/actions/brands";
import StatsPageClient from "@/components/dashboard/stats-page";

export default async function StatistiquesPage() {
  const [collaborations, payments, brandsRaw] = await Promise.all([
    getCollaborations(),
    getPayments(),
    getBrands(),
  ]);

  // Build brand stats from collaborations and payments
  const brands = brandsRaw.map((b) => ({
    ...b,
    collaborations: collaborations.filter((c) => c.brand.name === b.name),
    payments: payments.filter((p) => p.brand.name === b.name),
  }));

  // KPIs
  const totalRevenue =
    payments
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + p.amount, 0) +
    collaborations
      .filter((c) => c.status === "paid")
      .reduce((s, c) => s + c.amount, 0);

  const completedCollabs = collaborations.filter(
    (c) => c.status === "paid" || c.status === "invoiced"
  ).length;

  const avgPerCollab =
    completedCollabs > 0 ? Math.round(totalRevenue / completedCollabs) : 0;

  const totalCollabs = collaborations.length;
  const convertedCollabs = collaborations.filter(
    (c) => !["lead"].includes(c.status)
  ).length;
  const conversionRate =
    totalCollabs > 0 ? Math.round((convertedCollabs / totalCollabs) * 100) : 0;

  const kpis = {
    totalRevenue,
    completedCollabs,
    avgPerCollab,
    conversionRate,
  };

  // Monthly revenue from paid collaborations (group by month)
  const monthlyMap = new Map<string, number>();
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  // Use paid collabs and paid payments for revenue timeline
  for (const c of collaborations.filter((c) => c.status === "paid")) {
    const d = new Date(c.updatedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + c.amount);
  }
  for (const p of payments.filter((p) => p.status === "paid" && p.paidDate)) {
    const d = new Date(p.paidDate!);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + p.amount);
  }

  // Build last 6 months of data
  const now = new Date();
  const monthlyRevenue: { month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    monthlyRevenue.push({
      month: monthNames[d.getMonth()],
      value: monthlyMap.get(key) || 0,
    });
  }

  // Platform breakdown
  const platformMap = new Map<
    string,
    { collabs: number; revenue: number }
  >();
  for (const c of collaborations) {
    const existing = platformMap.get(c.platform) || {
      collabs: 0,
      revenue: 0,
    };
    existing.collabs++;
    if (c.status === "paid" || c.status === "invoiced") {
      existing.revenue += c.amount;
    }
    platformMap.set(c.platform, existing);
  }
  const totalPlatformRevenue = Array.from(platformMap.values()).reduce(
    (s, p) => s + p.revenue,
    0
  );
  const platformStats = Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      collabs: data.collabs,
      revenue: data.revenue,
      percentage:
        totalPlatformRevenue > 0
          ? Math.round((data.revenue / totalPlatformRevenue) * 100)
          : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top brands
  const topBrands = brands
    .map((b) => {
      const brandRevenue =
        b.payments
          .filter((p) => p.status === "paid")
          .reduce((s, p) => s + p.amount, 0) +
        b.collaborations
          .filter((c) => c.status === "paid")
          .reduce((s, c) => s + c.amount, 0);
      return {
        name: b.name,
        revenue: brandRevenue,
        campaigns: b.collaborations.length,
      };
    })
    .filter((b) => b.campaigns > 0 || b.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const maxBrandRevenue = Math.max(...topBrands.map((b) => b.revenue), 1);

  // Status breakdown for donut chart
  const statusCounts: Record<string, number> = {};
  for (const c of collaborations) {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  }
  const statusBreakdown = Object.entries(statusCounts).map(
    ([status, count]) => ({ status, count })
  );

  // Monthly collabs count (last 6 months)
  const monthlyCollabs: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = collaborations.filter((c) => {
      const created = new Date(c.createdAt);
      return created >= d && created < nextMonth;
    }).length;
    monthlyCollabs.push({ month: monthNames[d.getMonth()], count });
  }

  return (
    <StatsPageClient
      kpis={kpis}
      monthlyRevenue={monthlyRevenue}
      monthlyCollabs={monthlyCollabs}
      platformStats={platformStats}
      statusBreakdown={statusBreakdown}
      topBrands={topBrands.map((b) => ({
        ...b,
        percentage: Math.round((b.revenue / maxBrandRevenue) * 100),
      }))}
    />
  );
}
