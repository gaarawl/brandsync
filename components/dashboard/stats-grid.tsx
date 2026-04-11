"use client";

import { TrendingUp, Users, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

type Stats = {
  revenue: number;
  activeCollabs: number;
  pendingAmount: number;
  upcomingCount: number;
  nextDeadline: string | null;
};

export default function StatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Revenus (total)",
      value: `${stats.revenue.toLocaleString("fr-FR")} \u20ac`,
      sub:
        stats.revenue > 0
          ? "Collaborations pay\u00e9es"
          : "Aucun paiement re\u00e7u",
      subColor: stats.revenue > 0 ? "text-green-400" : "text-text-muted",
      icon: TrendingUp,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      label: "Collabs en cours",
      value: String(stats.activeCollabs),
      sub:
        stats.activeCollabs > 0
          ? "En production / n\u00e9gociation"
          : "Aucune collab active",
      subColor: stats.activeCollabs > 0 ? "text-green-400" : "text-text-muted",
      icon: Users,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      label: "Paiements en attente",
      value: `${stats.pendingAmount.toLocaleString("fr-FR")} \u20ac`,
      sub:
        stats.pendingAmount > 0
          ? "Factures \u00e0 encaisser"
          : "Aucun paiement en attente",
      subColor: stats.pendingAmount > 0 ? "text-yellow-400" : "text-text-muted",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      label: "Contenus \u00e0 rendre",
      value: String(stats.upcomingCount),
      sub: stats.nextDeadline
        ? `Prochain : ${stats.nextDeadline}`
        : "Aucune deadline",
      subColor: "text-text-muted",
      icon: FileText,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5 hover:border-border-medium transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className={`mt-1 text-xs ${stat.subColor}`}>{stat.sub}</p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
