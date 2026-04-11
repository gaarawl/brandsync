"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

type Props = {
  kpis: {
    totalRevenue: number;
    completedCollabs: number;
    avgPerCollab: number;
    conversionRate: number;
  };
  monthlyRevenue: { month: string; value: number }[];
  platformStats: {
    platform: string;
    collabs: number;
    revenue: number;
    percentage: number;
  }[];
  topBrands: {
    name: string;
    revenue: number;
    campaigns: number;
    percentage: number;
  }[];
};

export default function StatsPageClient({
  kpis,
  monthlyRevenue,
  platformStats,
  topBrands,
}: Props) {
  const kpiCards = [
    {
      label: "Revenu total",
      value: `${kpis.totalRevenue.toLocaleString("fr-FR")} €`,
      icon: DollarSign,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      label: "Collaborations terminées",
      value: String(kpis.completedCollabs),
      icon: Users,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      label: "Revenu moyen / collab",
      value: `${kpis.avgPerCollab.toLocaleString("fr-FR")} €`,
      icon: BarChart3,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Taux de conversion",
      value: `${kpis.conversionRate}%`,
      icon: TrendingUp,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
  ];

  // Chart calculations
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const chartWidth = 500;
  const chartHeight = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
  const iW = chartWidth - pad.left - pad.right;
  const iH = chartHeight - pad.top - pad.bottom;

  const getX = (i: number) =>
    pad.left + (i / Math.max(monthlyRevenue.length - 1, 1)) * iW;
  const getY = (val: number) => pad.top + iH - (val / maxRevenue) * iH;

  const linePath = monthlyRevenue
    .map((m, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(m.value)}`)
    .join(" ");

  const areaPath = `${linePath} L ${getX(monthlyRevenue.length - 1)} ${pad.top + iH} L ${getX(0)} ${pad.top + iH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: pad.top + iH - pct * iH,
    label: `${((pct * maxRevenue) / 1000).toFixed(0)}k`,
  }));

  const hasData =
    kpis.totalRevenue > 0 ||
    kpis.completedCollabs > 0 ||
    monthlyRevenue.some((m) => m.value > 0);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Statistiques</h1>
        <p className="text-sm text-text-muted mt-1">
          Vue d&apos;ensemble de votre activit&eacute;
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-text-muted uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-text-primary">
                  {kpi.value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.iconBg}`}
              >
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Revenus mensuels
            </h2>
            <span className="text-xs text-text-muted">
              6 derniers mois
            </span>
          </div>

          {!hasData ? (
            <div className="flex items-center justify-center h-48 text-sm text-text-muted">
              Ajoutez des collaborations pour voir vos stats.
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto"
            >
              <defs>
                <linearGradient
                  id="areaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="lineGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {gridLines.map((g) => (
                <g key={g.label}>
                  <line
                    x1={pad.left}
                    y1={g.y}
                    x2={chartWidth - pad.right}
                    y2={g.y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={pad.left - 8}
                    y={g.y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-[#71717A]"
                  >
                    {g.label}
                  </text>
                </g>
              ))}

              <path d={areaPath} fill="url(#areaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {monthlyRevenue.map((m, i) => (
                <g key={m.month}>
                  <circle
                    cx={getX(i)}
                    cy={getY(m.value)}
                    r="4"
                    fill="#0B0B0D"
                    stroke="#A78BFA"
                    strokeWidth="2"
                  />
                  {m.value > 0 && (
                    <text
                      x={getX(i)}
                      y={getY(m.value) - 12}
                      textAnchor="middle"
                      className="text-[9px] fill-[#A1A1AA] font-medium"
                    >
                      {(m.value / 1000).toFixed(1)}k
                    </text>
                  )}
                  <text
                    x={getX(i)}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-[#71717A]"
                  >
                    {m.month}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </motion.div>

        {/* Platform breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <h2 className="text-sm font-semibold text-text-primary mb-6">
            R&eacute;partition par plateforme
          </h2>
          {platformStats.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-text-muted">
              Aucune donn&eacute;e de plateforme.
            </div>
          ) : (
            <div className="space-y-5">
              {platformStats.map((p) => (
                <div key={p.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        {p.platform}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        {p.collabs} collabs
                      </span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {p.revenue.toLocaleString("fr-FR")} &euro;
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-primary">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-accent/60 to-accent"
                      style={{ width: `${Math.max(p.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <h2 className="text-sm font-semibold text-text-primary">
            Top marques par revenus
          </h2>
        </div>
        {topBrands.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            Ajoutez des marques et collaborations pour voir le classement.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {topBrands.map((b, i) => (
              <div key={b.name} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-sm font-bold text-text-muted w-6">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">
                      {b.name}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {b.revenue.toLocaleString("fr-FR")} &euro;
                    </span>
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
        )}
      </motion.div>
    </main>
  );
}
