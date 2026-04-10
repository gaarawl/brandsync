"use client";

import { motion } from "framer-motion";

const events = [
  {
    day: "15",
    month: "MAI",
    label: "Rendu UGC Factory",
    sub: "Livrer 3 vidéos TikTok",
    accent: "border-l-green-500",
  },
  {
    day: "18",
    month: "MAI",
    label: "Appel découverte",
    sub: "Summer Campaign",
    accent: "border-l-blue-500",
  },
  {
    day: "22",
    month: "MAI",
    label: "Publication",
    sub: "Glow Beauty",
    accent: "border-l-accent",
  },
  {
    day: "25",
    month: "MAI",
    label: "Facture à envoyer",
    sub: "TechNova · 2 800 €",
    accent: "border-l-yellow-500",
  },
];

export default function CalendarWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-xl border border-border-subtle bg-bg-surface"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary">Calendrier</h2>
        <button className="text-xs text-accent hover:text-accent-glow transition-colors">
          Voir le calendrier
        </button>
      </div>

      <div className="p-3 space-y-2">
        {events.map((evt) => (
          <div
            key={evt.label}
            className={`flex items-start gap-3 rounded-lg bg-bg-primary px-3.5 py-3 border border-border-subtle border-l-2 ${evt.accent}`}
          >
            <div className="flex flex-col items-center min-w-[28px]">
              <span className="text-sm font-bold text-accent leading-none">
                {evt.day}
              </span>
              <span className="text-[9px] text-text-muted uppercase">
                {evt.month}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {evt.label}
              </p>
              <p className="text-[11px] text-text-muted truncate">{evt.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
