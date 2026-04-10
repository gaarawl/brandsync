"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", value: 4200 },
  { month: "Fév", value: 5800 },
  { month: "Mar", value: 4900 },
  { month: "Avr", value: 8200 },
  { month: "Mai", value: 12540 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

const topBrands = [
  { name: "CloudFit", revenue: "5 600 €", campaigns: 2, percentage: 75 },
  { name: "UGC Factory", revenue: "6 400 €", campaigns: 5, percentage: 85 },
  { name: "Summer Campaign", revenue: "4 800 €", campaigns: 2, percentage: 64 },
  { name: "TechNova", revenue: "2 800 €", campaigns: 1, percentage: 37 },
  { name: "Glow Beauty", revenue: "3 200 €", campaigns: 3, percentage: 43 },
];

const platformStats = [
  { platform: "TikTok", collabs: 8, revenue: "9 200 €", percentage: 45 },
  { platform: "Instagram", collabs: 5, revenue: "5 600 €", percentage: 28 },
  { platform: "YouTube", collabs: 3, revenue: "6 000 €", percentage: 27 },
];

const kpis = [
  {
    label: "Revenu total",
    value: "35 640 €",
    change: "+24%",
    positive: true,
    icon: DollarSign,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
  },
  {
    label: "Collaborations terminées",
    value: "18",
    change: "+6",
    positive: true,
    icon: Users,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    label: "Revenu moyen / collab",
    value: "1 980 €",
    change: "+12%",
    positive: true,
    icon: BarChart3,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    label: "Taux de conversion",
    value: "72%",
    change: "-3%",
    positive: false,
    icon: TrendingUp,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
  },
];

export default function StatistiquesPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Statistiques</h1>
        <p className="text-sm text-text-muted mt-1">
          Vue d&apos;ensemble de votre activité en 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-text-muted uppercase tracking-wider">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold text-text-primary">{kpi.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {kpi.positive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                  )}
                  <span className={`text-xs ${kpi.positive ? "text-green-400" : "text-red-400"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-text-muted">vs mois dernier</span>
                </div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <h2 className="text-sm font-semibold text-text-primary mb-6">Revenus mensuels</h2>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-text-primary">
                  {(m.value / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent/50 to-accent transition-all"
                  style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                />
                <span className="text-[11px] text-text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platform breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <h2 className="text-sm font-semibold text-text-primary mb-6">Répartition par plateforme</h2>
          <div className="space-y-5">
            {platformStats.map((p) => (
              <div key={p.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{p.platform}</span>
                    <span className="text-xs text-text-muted ml-2">{p.collabs} collabs</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{p.revenue}</span>
                </div>
                <div className="h-2 rounded-full bg-bg-primary">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-accent/60 to-accent"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top brands */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border-subtle bg-bg-surface"
      >
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-text-primary">Top marques par revenus</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {topBrands
            .sort((a, b) => b.percentage - a.percentage)
            .map((b, i) => (
              <div key={b.name} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-sm font-bold text-text-muted w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{b.name}</span>
                    <span className="text-sm font-medium text-text-primary">{b.revenue}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-primary">
                    <div
                      className="h-1.5 rounded-full bg-accent/70"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </main>
  );
}
