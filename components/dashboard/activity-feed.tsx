"use client";

import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

type Activity = {
  id: string;
  type: "collab" | "payment" | "email" | "deadline";
  title: string;
  description: string;
  date: string;
  status?: "success" | "warning" | "info";
};

const iconMap = {
  collab: Users,
  payment: CreditCard,
  email: Mail,
  deadline: FileText,
};

const statusIcon = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Clock,
};

const statusColors = {
  success: "text-green-400 bg-green-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  info: "text-blue-400 bg-blue-500/10",
};

export default function ActivityFeed({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-premium rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Activité récente
        </h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-text-muted py-6 text-center">
          Aucune activité récente
        </p>
      ) : (
        <div className="space-y-1">
          {activities.map((activity, i) => {
            const Icon = iconMap[activity.type];
            const status = activity.status || "info";
            const StatusIcon = statusIcon[status];
            const colors = statusColors[status];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-bg-elevated/50 transition-colors"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {activity.title}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-[10px] text-text-muted shrink-0 mt-0.5">
                  {activity.date}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
