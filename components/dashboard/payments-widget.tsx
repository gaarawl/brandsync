"use client";

import { motion } from "framer-motion";

const payments = [
  {
    brand: "UGC Factory",
    amount: "+1 200 €",
    status: "Payé",
    statusColor: "text-green-400 bg-green-500/10",
    avatar: "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  },
  {
    brand: "Glow Beauty",
    amount: "+950 €",
    status: "En attente",
    statusColor: "text-yellow-400 bg-yellow-500/10",
    avatar: "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  },
  {
    brand: "TechNova",
    amount: "+2 800 €",
    status: "En attente",
    statusColor: "text-yellow-400 bg-yellow-500/10",
    avatar: "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  },
  {
    brand: "Summer Campaign",
    amount: "+2 400 €",
    status: "En attente",
    statusColor: "text-yellow-400 bg-yellow-500/10",
    avatar: "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  },
];

export default function PaymentsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="rounded-xl border border-border-subtle bg-bg-surface"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary">
          Paiements récents
        </h2>
        <button className="text-xs text-accent hover:text-accent-glow transition-colors">
          Voir tout
        </button>
      </div>

      <div className="divide-y divide-border-subtle">
        {payments.map((p) => (
          <div
            key={p.brand}
            className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full shrink-0 ${p.avatar}`}
              />
              <span className="text-sm text-text-primary">{p.brand}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-primary">
                {p.amount}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.statusColor}`}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
