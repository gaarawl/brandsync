"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Pencil,
  Send,
  CheckCircle2,
  Phone,
  Receipt,
  Clock,
  Video,
  Calendar,
} from "lucide-react";
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions/events";

type CalEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  notes: string | null;
  isDeadline: boolean;
};

const typeColors: Record<string, string> = {
  Livrable: "bg-green-500/15 text-green-400",
  Validation: "bg-yellow-500/15 text-yellow-400",
  Appel: "bg-blue-500/15 text-blue-400",
  Paiement: "bg-emerald-500/15 text-emerald-400",
  Facture: "bg-accent/15 text-accent",
  Publication: "bg-pink-500/15 text-pink-400",
  Relance: "bg-orange-500/15 text-orange-400",
  Autre: "bg-zinc-500/15 text-zinc-400",
};

const dotColors: Record<string, string> = {
  Livrable: "bg-green-500",
  Validation: "bg-yellow-500",
  Appel: "bg-blue-500",
  Paiement: "bg-emerald-500",
  Facture: "bg-accent",
  Publication: "bg-pink-500",
  Relance: "bg-orange-500",
  Autre: "bg-zinc-500",
};

const typeIcons: Record<string, typeof Send> = {
  Livrable: Send,
  Validation: CheckCircle2,
  Appel: Phone,
  Paiement: Receipt,
  Facture: Receipt,
  Publication: Video,
  Relance: Clock,
  Autre: Calendar,
};

const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthNames = [
  "Janvier",
  "F\u00e9vrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Ao\u00fbt",
  "Septembre",
  "Octobre",
  "Novembre",
  "D\u00e9cembre",
];

const inputClass =
  "mt-1 w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function CalendarPage({ events }: { events: CalEvent[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    now.getDate()
  );
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<CalEvent | null>(null);
  const [isPending, startTransition] = useTransition();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOffset(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Filter events for current month
  const monthEvents = events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const getEventsForDay = (day: number) =>
    monthEvents.filter((e) => new Date(e.date).getDate() === day);

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const today = now.getDate();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  // Upcoming events (from today onward)
  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date(now.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  };

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createEvent(formData);
      setShowModal(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editEvent) return;
    startTransition(async () => {
      await updateEvent(editEvent.id, formData);
      setEditEvent(null);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cet \u00e9v\u00e9nement ?")) return;
    startTransition(() => deleteEvent(id));
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Calendrier</h1>
          <p className="text-sm text-text-muted mt-1">
            {monthEvents.length} \u00e9v\u00e9nement
            {monthEvents.length > 1 ? "s" : ""} en{" "}
            {monthNames[month].toLowerCase()} {year}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvel \u00e9v\u00e9nement
        </button>
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
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-text-primary">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] text-text-muted font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const dayEvts = getEventsForDay(day);
              const hasEvents = dayEvts.length > 0;
              const isSelected = selectedDay === day;
              const isToday = isCurrentMonth && day === today;

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
                      {dayEvts.slice(0, 3).map((e, j) => (
                        <span
                          key={j}
                          className={`h-1 w-1 rounded-full ${dotColors[e.type] || dotColors.Autre}`}
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
              {selectedDay
                ? `${selectedDay} ${monthNames[month].toLowerCase()} ${year}`
                : "S\u00e9lectionnez un jour"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {dayEvents.length} \u00e9v\u00e9nement
              {dayEvents.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-3 space-y-2">
            {dayEvents.length > 0 ? (
              dayEvents.map((evt) => {
                const Icon = typeIcons[evt.type] || typeIcons.Autre;
                const dotColor = dotColors[evt.type] || dotColors.Autre;
                return (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 rounded-lg bg-bg-primary px-3.5 py-3 border border-border-subtle"
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg ${dotColor}/15`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${dotColor.replace("bg-", "text-")}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary">
                        {evt.title}
                      </p>
                      <span
                        className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[evt.type] || typeColors.Autre}`}
                      >
                        {evt.type}
                      </span>
                      {evt.notes && (
                        <p className="mt-1 text-[11px] text-text-muted">
                          {evt.notes}
                        </p>
                      )}
                    </div>
                    {!evt.isDeadline && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditEvent(evt)}
                          className="p-1 rounded text-text-muted hover:text-accent"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="p-1 rounded text-text-muted hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-text-muted">
                Rien de pr\u00e9vu ce jour.
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
          <h2 className="text-sm font-semibold text-text-primary">
            Prochains \u00e9v\u00e9nements
          </h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            Aucun \u00e9v\u00e9nement \u00e0 venir.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {upcoming.map((evt) => {
              const d = new Date(evt.date);
              return (
                <div
                  key={evt.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center min-w-[32px]">
                      <span className="text-sm font-bold text-accent">
                        {d.getDate()}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase">
                        {d
                          .toLocaleDateString("fr-FR", { month: "short" })
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">{evt.title}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${typeColors[evt.type] || typeColors.Autre}`}
                  >
                    {evt.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <EventModal
            title="Nouvel \u00e9v\u00e9nement"
            defaultDate={
              selectedDay
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
                : ""
            }
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editEvent && (
          <EventModal
            title="Modifier l'\u00e9v\u00e9nement"
            event={editEvent}
            onClose={() => setEditEvent(null)}
            onSubmit={handleUpdate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function EventModal({
  title,
  event,
  defaultDate,
  onClose,
  onSubmit,
  isPending,
}: {
  title: string;
  event?: CalEvent;
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  const dateDefault = event
    ? new Date(event.date).toISOString().split("T")[0]
    : defaultDate || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">Titre *</label>
            <input
              name="title"
              defaultValue={event?.title || ""}
              required
              placeholder="ex: Appel brief Nike"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Type</label>
              <select
                name="type"
                defaultValue={event?.type || "Autre"}
                className={inputClass}
              >
                <option value="Livrable">Livrable</option>
                <option value="Validation">Validation</option>
                <option value="Appel">Appel</option>
                <option value="Paiement">Paiement</option>
                <option value="Facture">Facture</option>
                <option value="Publication">Publication</option>
                <option value="Relance">Relance</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted">Date *</label>
              <input
                name="date"
                type="date"
                defaultValue={dateDefault}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Notes</label>
            <textarea
              name="notes"
              defaultValue={event?.notes || ""}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : event ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
