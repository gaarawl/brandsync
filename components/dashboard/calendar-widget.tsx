"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type CalendarEvent = {
  day: string;
  month: string;
  label: string;
  sub: string;
};

const accentColors = [
  "border-l-green-500",
  "border-l-blue-500",
  "border-l-accent",
  "border-l-yellow-500",
];

export default function CalendarWidget({
  events,
}: {
  events: CalendarEvent[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-xl border border-border-subtle bg-bg-surface"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary">Calendrier</h2>
        <Link
          href="/dashboard/calendrier"
          className="text-xs text-accent hover:text-accent-glow transition-colors"
        >
          Voir le calendrier
        </Link>
      </div>

      <div className="p-3 space-y-2">
        {events.length === 0 ? (
          <div className="py-4 text-center text-xs text-text-muted">
            Aucune deadline à venir.
          </div>
        ) : (
          events.map((evt, i) => (
            <div
              key={`${evt.day}-${evt.label}`}
              className={`flex items-start gap-3 rounded-lg bg-bg-primary px-3.5 py-3 border border-border-subtle border-l-2 ${accentColors[i % accentColors.length]}`}
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
                <p className="text-[11px] text-text-muted truncate">
                  {evt.sub}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
