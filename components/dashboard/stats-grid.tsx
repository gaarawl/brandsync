"use client";

import { TrendingUp, Users, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Revenus (mois)",
    value: "12 540 €",
    sub: "+24% vs mois dernier",
    subColor: "text-green-400",
    icon: TrendingUp,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
  },
  {
    label: "Collabs en cours",
    value: "7",
    sub: "+2 cette semaine",
    subColor: "text-green-400",
    icon: Users,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    label: "Paiements en attente",
    value: "3 950 €",
    sub: "2 factures à relancer",
    subColor: "text-yellow-400",
    icon: Clock,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
  },
  {
    label: "Contenus à rendre",
    value: "4",
    sub: "Prochain : 15 mai",
    subColor: "text-text-muted",
    icon: FileText,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
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
