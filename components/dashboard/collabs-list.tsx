"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

const collabs = [
  {
    brand: "UGC Factory",
    platform: "TikTok · 3 vidéos",
    status: "En production",
    statusColor: "bg-green-500/15 text-green-400",
    date: "15 mai",
    amount: "1 200 €",
    avatar: "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  },
  {
    brand: "Summer Campaign",
    platform: "Instagram · 2 reels",
    status: "Brief reçu",
    statusColor: "bg-accent/15 text-accent",
    date: "18 mai",
    amount: "2 400 €",
    avatar: "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  },
  {
    brand: "Glow Beauty",
    platform: "TikTok · 1 vidéo + 1 story",
    status: "En attente validation",
    statusColor: "bg-yellow-500/15 text-yellow-400",
    date: "22 mai",
    amount: "950 €",
    avatar: "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  },
  {
    brand: "TechNova",
    platform: "YouTube · 1 vidéo",
    status: "Négociation",
    statusColor: "bg-orange-500/15 text-orange-400",
    date: "—",
    amount: "2 800 €",
    avatar: "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  },
  {
    brand: "FitLab Pro",
    platform: "Instagram · 3 stories",
    status: "Nouveau lead",
    statusColor: "bg-blue-500/15 text-blue-400",
    date: "—",
    amount: "800 €",
    avatar: "bg-gradient-to-br from-violet-500/40 to-indigo-500/40",
  },
];

export default function CollabsList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="rounded-xl border border-border-subtle bg-bg-surface"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary">
          Collaborations en cours
        </h2>
        <button className="text-xs text-accent hover:text-accent-glow transition-colors">
          Voir tout
        </button>
      </div>

      <div className="divide-y divide-border-subtle">
        {collabs.map((c) => (
          <div
            key={c.brand}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-9 w-9 rounded-full shrink-0 ${c.avatar}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {c.brand}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {c.platform}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-block ${c.statusColor}`}
              >
                {c.status}
              </span>
              <span className="hidden text-xs text-text-muted md:block w-14 text-right">
                {c.date}
              </span>
              <span className="hidden text-xs font-medium text-text-primary lg:block w-16 text-right">
                {c.amount}
              </span>
              <button className="text-text-muted hover:text-text-primary transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
