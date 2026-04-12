"use client";

import { TrendingUp, Users, Clock, FileText, ArrowUp, ArrowDown, Mail, Building2 } from "lucide-react";
import { motion } from "framer-motion";

type Stats = {
  revenue: number;
  revenueGrowth: number;
  activeCollabs: number;
  pendingAmount: number;
  upcomingCount: number;
  nextDeadline: string | null;
  brandsCount: number;
  emailsSent: number;
};

export default function StatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Revenus (total)",
      value: `${stats.revenue.toLocaleString("fr-FR")} €`,
      sub:
        stats.revenueGrowth !== 0
          ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}% vs mois dernier`
          : stats.revenue > 0
          ? "Collaborations payées"
          : "Aucun paiement reçu",
      subColor:
        stats.revenueGrowth > 0
          ? "text-green-400"
          : stats.revenueGrowth < 0
          ? "text-red-400"
          : stats.revenue > 0
          ? "text-green-400"
          : "text-text-muted",
      icon: TrendingUp,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      trend: stats.revenueGrowth,
    },
    {
      label: "Collabs en cours",
      value: String(stats.activeCollabs),
      sub:
        stats.activeCollabs > 0
          ? "En production / négociation"
          : "Aucune collab active",
      subColor: stats.activeCollabs > 0 ? "text-accent" : "text-text-muted",
      icon: Users,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      label: "Paiements en attente",
      value: `${stats.pendingAmount.toLocaleString("fr-FR")} €`,
      sub:
        stats.pendingAmount > 0
          ? "Factures à encaisser"
          : "Aucun paiement en attente",
      subColor: stats.pendingAmount > 0 ? "text-yellow-400" : "text-text-muted",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      label: "Marques partenaires",
      value: String(stats.brandsCount),
      sub:
        stats.brandsCount > 0
          ? `${stats.emailsSent} email(s) envoyé(s)`
          : "Ajoute ta première marque",
      subColor: stats.brandsCount > 0 ? "text-blue-400" : "text-text-muted",
      icon: Building2,
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
          className="card-premium rounded-xl p-5 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-text-primary tracking-tight">
                {stat.value}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {"trend" in stat && stat.trend !== undefined && stat.trend !== 0 && (
                  <span
                    className={`flex items-center ${
                      stat.trend > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.trend > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </span>
                )}
                <p className={`text-xs ${stat.subColor}`}>{stat.sub}</p>
              </div>
            </div>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
