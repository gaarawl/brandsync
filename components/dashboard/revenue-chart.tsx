"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type MonthData = {
  label: string;
  amount: number;
};

export default function RevenueChart({
  data,
  totalRevenue,
  growth,
}: {
  data: MonthData[];
  totalRevenue: number;
  growth: number;
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-premium rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
            Revenus sur 6 mois
          </p>
          <p className="mt-1 text-2xl font-bold text-text-primary tracking-tight">
            {totalRevenue.toLocaleString("fr-FR")} €
          </p>
        </div>
        {growth !== 0 && (
          <div
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
              growth > 0
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {growth > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {growth > 0 ? "+" : ""}
            {growth}%
          </div>
        )}
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-32">
        {data.map((month, i) => {
          const height = max > 0 ? (month.amount / max) * 100 : 0;
          const isCurrentMonth = i === data.length - 1;

          return (
            <div key={month.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex justify-center h-[100px]">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className={`w-full max-w-[40px] rounded-t-md ${
                    isCurrentMonth
                      ? "bg-accent shadow-md shadow-accent/20"
                      : "bg-accent/20 hover:bg-accent/35 transition-colors"
                  }`}
                  style={{ position: "absolute", bottom: 0 }}
                  title={`${month.amount.toLocaleString("fr-FR")} €`}
                />
              </div>
              <span className="text-[10px] text-text-muted font-medium">
                {month.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
