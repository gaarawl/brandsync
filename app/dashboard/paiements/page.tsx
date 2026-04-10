"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, AlertCircle, Search, Download } from "lucide-react";

type FilterType = "all" | "paid" | "pending" | "overdue";

const payments = [
  {
    id: 1,
    brand: "UGC Factory",
    campaign: "Campagne TikTok Q1",
    amount: "1 200 €",
    status: "paid",
    date: "28 avril 2026",
    invoiceDate: "15 avril 2026",
    avatar: "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  },
  {
    id: 2,
    brand: "CloudFit",
    campaign: "Sponsoring YouTube",
    amount: "3 200 €",
    status: "pending",
    date: "10 mai 2026",
    invoiceDate: "1 mai 2026",
    avatar: "bg-gradient-to-br from-sky-500/40 to-blue-500/40",
  },
  {
    id: 3,
    brand: "Glow Beauty",
    campaign: "TikTok + Story",
    amount: "950 €",
    status: "overdue",
    date: "5 mai 2026",
    invoiceDate: "20 avril 2026",
    avatar: "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  },
  {
    id: 4,
    brand: "TechNova",
    campaign: "Vidéo YouTube",
    amount: "2 800 €",
    status: "pending",
    date: "25 mai 2026",
    invoiceDate: "—",
    avatar: "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  },
  {
    id: 5,
    brand: "Summer Campaign",
    campaign: "2 Reels Instagram",
    amount: "2 400 €",
    status: "pending",
    date: "18 mai 2026",
    invoiceDate: "8 mai 2026",
    avatar: "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  },
  {
    id: 6,
    brand: "NovaSkin",
    campaign: "2 vidéos TikTok",
    amount: "1 600 €",
    status: "paid",
    date: "3 mai 2026",
    invoiceDate: "18 avril 2026",
    avatar: "bg-gradient-to-br from-amber-500/40 to-yellow-500/40",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Payé", color: "bg-green-500/15 text-green-400" },
  pending: { label: "En attente", color: "bg-yellow-500/15 text-yellow-400" },
  overdue: { label: "En retard", color: "bg-red-500/15 text-red-400" },
};

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "paid", label: "Payés" },
  { key: "pending", label: "En attente" },
  { key: "overdue", label: "En retard" },
];

export default function PaiementsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = payments.filter(
    (p) => activeFilter === "all" || p.status === activeFilter
  );

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + parseInt(p.amount.replace(/\D/g, "")), 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + parseInt(p.amount.replace(/\D/g, "")), 0);
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + parseInt(p.amount.replace(/\D/g, "")), 0);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">Paiements</h1>
        <p className="text-sm text-text-muted mt-1">
          Suivi de vos factures et paiements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">Reçus</p>
              <p className="text-xl font-bold text-text-primary">{totalPaid.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">En attente</p>
              <p className="text-xl font-bold text-text-primary">{totalPending.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border-subtle bg-bg-surface p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">En retard</p>
              <p className="text-xl font-bold text-text-primary">{totalOverdue.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === f.key
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden"
      >
        <div className="hidden sm:grid sm:grid-cols-6 gap-4 px-5 py-3 border-b border-border-subtle text-[11px] text-text-muted uppercase tracking-wider">
          <span className="col-span-2">Marque / Campagne</span>
          <span>Montant</span>
          <span>Statut</span>
          <span>Date facture</span>
          <span>Échéance</span>
        </div>

        <div className="divide-y divide-border-subtle">
          {filtered.map((p) => {
            const st = statusConfig[p.status];
            return (
              <div
                key={p.id}
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 items-center px-5 py-4 hover:bg-bg-elevated/50 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full shrink-0 ${p.avatar}`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{p.brand}</p>
                    <p className="text-xs text-text-muted">{p.campaign}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-text-primary">{p.amount}</p>
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`}>
                  {st.label}
                </span>
                <p className="text-sm text-text-secondary">{p.invoiceDate}</p>
                <p className="text-sm text-text-secondary">{p.date}</p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-text-muted">
            Aucun paiement trouvé.
          </div>
        )}
      </motion.div>
    </main>
  );
}
