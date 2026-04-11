"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type PaymentItem = {
  id: string;
  brand: string;
  amount: string;
  status: string;
  statusColor: string;
  brandName: string;
};

const avatarColors = [
  "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  "bg-gradient-to-br from-violet-500/40 to-indigo-500/40",
  "bg-gradient-to-br from-sky-500/40 to-blue-500/40",
  "bg-gradient-to-br from-amber-500/40 to-yellow-500/40",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function PaymentsWidget({
  payments,
}: {
  payments: PaymentItem[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="rounded-xl border border-border-subtle bg-bg-surface"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary">
          Paiements r&eacute;cents
        </h2>
        <Link
          href="/dashboard/paiements"
          className="text-xs text-accent hover:text-accent-glow transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="divide-y divide-border-subtle">
        {payments.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs text-text-muted">
            Aucun paiement enregistr&eacute;.
          </div>
        ) : (
          payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full shrink-0 ${getAvatarColor(p.brandName)}`}
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
          ))
        )}
      </div>
    </motion.div>
  );
}
