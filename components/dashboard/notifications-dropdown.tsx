"use client";

import { useState } from "react";
import { Bell, Clock, AlertTriangle, CalendarClock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: string;
  type: "deadline" | "overdue" | "upcoming";
  title: string;
  description: string;
  date: string;
};

export default function NotificationsDropdown({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [open, setOpen] = useState(false);

  const iconMap = {
    deadline: CalendarClock,
    overdue: AlertTriangle,
    upcoming: Clock,
  };

  const colorMap = {
    deadline: "text-yellow-400 bg-yellow-500/10",
    overdue: "text-red-400 bg-red-500/10",
    upcoming: "text-blue-400 bg-blue-500/10",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border-subtle bg-bg-surface shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <h3 className="text-sm font-semibold text-text-primary">
                  Notifications
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    Aucune notification.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = iconMap[n.type];
                    const colors = colorMap[n.type];
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-elevated/50 transition-colors"
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-text-primary">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {n.description}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">
                            {n.date}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
