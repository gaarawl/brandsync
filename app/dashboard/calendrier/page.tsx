"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, CheckCircle2, Phone, Receipt, Clock, Video } from "lucide-react";

const daysInMonth = 31; // Mai 2026
const firstDayOffset = 4; // Mai 2026 commence un vendredi (index 4)
const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface CalEvent {
  day: number;
  label: string;
  type: string;
  color: string;
  icon: typeof Send;
}

const events: CalEvent[] = [
  { day: 3, label: "Paiement NovaSkin", type: "Paiement", color: "bg-emerald-500", icon: Receipt },
  { day: 8, label: "Appel brief FitLab", type: "Appel", color: "bg-blue-500", icon: Phone },
  { day: 12, label: "Rendu TikTok Glow Beauty", type: "Livrable", color: "bg-green-500", icon: Send },
  { day: 15, label: "Rendu UGC Factory", type: "Livrable", color: "bg-green-500", icon: Video },
  { day: 15, label: "Validation CloudFit", type: "Validation", color: "bg-yellow-500", icon: CheckCircle2 },
  { day: 18, label: "Appel Summer Campaign", type: "Appel", color: "bg-blue-500", icon: Phone },
  { day: 20, label: "Publication Instagram", type: "Publication", color: "bg-pink-500", icon: Send },
  { day: 22, label: "Publication Glow Beauty", type: "Publication", color: "bg-pink-500", icon: Send },
  { day: 25, label: "Facture TechNova", type: "Facture", color: "bg-accent", icon: Receipt },
  { day: 28, label: "Deadline Summer Campaign", type: "Livrable", color: "bg-green-500", icon: Clock },
  { day: 30, label: "Relance paiement Glow Beauty", type: "Relance", color: "bg-orange-500", icon: Receipt },
];

const typeColors: Record<string, string> = {
  Livrable: "bg-green-500/15 text-green-400",
  Validation: "bg-yellow-500/15 text-yellow-400",
  Appel: "bg-blue-500/15 text-blue-400",
  Paiement: "bg-emerald-500/15 text-emerald-400",
  Facture: "bg-accent/15 text-accent",
  Publication: "bg-pink-500/15 text-pink-400",
  Relance: "bg-orange-500/15 text-orange-400",
};

export default function CalendrierPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  const dayEvents = selectedDay
    ? events.filter((e) => e.day === selectedDay)
    : [];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Calendrier</h1>
        <p className="text-sm text-text-muted mt-1">
          {events.length} événements en mai 2026
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-5">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-text-primary">Mai 2026</h2>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[11px] text-text-muted font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />;
              }
              const hasEvents = events.some((e) => e.day === day);
              const isSelected = selectedDay === day;
              const isToday = day === 11;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col items-center justify-center rounded-lg py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                      : isToday
                      ? "bg-bg-elevated text-text-primary font-medium"
                      : "text-text-secondary hover:bg-bg-elevated"
                  }`}
                >
                  {day}
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {events
                        .filter((e) => e.day === day)
                        .slice(0, 3)
                        .map((e, j) => (
                          <span
                            key={j}
                            className={`h-1 w-1 rounded-full ${e.color}`}
                          />
                        ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Day detail panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-border-subtle bg-bg-surface"
        >
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="text-sm font-semibold text-text-primary">
              {selectedDay ? `${selectedDay} mai 2026` : "Sélectionnez un jour"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-3 space-y-2">
            {dayEvents.length > 0 ? (
              dayEvents.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-bg-primary px-3.5 py-3 border border-border-subtle"
                >
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg ${evt.color}/15`}>
                    <evt.icon className={`h-3.5 w-3.5 ${evt.color.replace("bg-", "text-")}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-primary">{evt.label}</p>
                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[evt.type]}`}>
                      {evt.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-text-muted">
                Rien de prévu ce jour.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming events list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border-subtle bg-bg-surface"
      >
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-text-primary">Prochains événements</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {events
            .filter((e) => e.day >= 11)
            .slice(0, 6)
            .map((evt, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center min-w-[32px]">
                    <span className="text-sm font-bold text-accent">{evt.day}</span>
                    <span className="text-[9px] text-text-muted">MAI</span>
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">{evt.label}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${typeColors[evt.type]}`}>
                  {evt.type}
                </span>
              </div>
            ))}
        </div>
      </motion.div>
    </main>
  );
}
