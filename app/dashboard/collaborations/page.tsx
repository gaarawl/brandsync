"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, ArrowRight } from "lucide-react";

type Status = "all" | "lead" | "negotiation" | "production" | "invoiced" | "paid";

const statusConfig: Record<string, { label: string; color: string }> = {
  lead: { label: "Nouveau lead", color: "bg-blue-500/15 text-blue-400" },
  negotiation: { label: "Négociation", color: "bg-orange-500/15 text-orange-400" },
  production: { label: "En production", color: "bg-green-500/15 text-green-400" },
  validation: { label: "En attente validation", color: "bg-yellow-500/15 text-yellow-400" },
  invoiced: { label: "Facture envoyée", color: "bg-accent/15 text-accent" },
  paid: { label: "Payé", color: "bg-emerald-500/15 text-emerald-400" },
};

const collabs = [
  {
    id: 1,
    brand: "UGC Factory",
    platform: "TikTok",
    deliverables: "3 vidéos",
    status: "production",
    deadline: "15 mai 2026",
    amount: "1 200 €",
    avatar: "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  },
  {
    id: 2,
    brand: "Summer Campaign",
    platform: "Instagram",
    deliverables: "2 reels",
    status: "negotiation",
    deadline: "18 mai 2026",
    amount: "2 400 €",
    avatar: "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  },
  {
    id: 3,
    brand: "Glow Beauty",
    platform: "TikTok",
    deliverables: "1 vidéo + 1 story",
    status: "validation",
    deadline: "22 mai 2026",
    amount: "950 €",
    avatar: "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  },
  {
    id: 4,
    brand: "TechNova",
    platform: "YouTube",
    deliverables: "1 vidéo",
    status: "negotiation",
    deadline: "—",
    amount: "2 800 €",
    avatar: "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  },
  {
    id: 5,
    brand: "FitLab Pro",
    platform: "Instagram",
    deliverables: "3 stories",
    status: "lead",
    deadline: "—",
    amount: "800 €",
    avatar: "bg-gradient-to-br from-violet-500/40 to-indigo-500/40",
  },
  {
    id: 6,
    brand: "NovaSkin",
    platform: "TikTok",
    deliverables: "2 vidéos",
    status: "paid",
    deadline: "3 mai 2026",
    amount: "1 600 €",
    avatar: "bg-gradient-to-br from-amber-500/40 to-yellow-500/40",
  },
  {
    id: 7,
    brand: "CloudFit",
    platform: "YouTube",
    deliverables: "1 vidéo sponsorisée",
    status: "invoiced",
    deadline: "10 mai 2026",
    amount: "3 200 €",
    avatar: "bg-gradient-to-br from-sky-500/40 to-blue-500/40",
  },
];

const filters: { key: Status; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "lead", label: "Leads" },
  { key: "negotiation", label: "Négociation" },
  { key: "production", label: "Production" },
  { key: "invoiced", label: "Facturées" },
  { key: "paid", label: "Payées" },
];

export default function CollaborationsPage() {
  const [activeFilter, setActiveFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");

  const filtered = collabs.filter((c) => {
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    const matchSearch = c.brand.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Collaborations</h1>
          <p className="text-sm text-text-muted mt-1">
            {collabs.length} collaborations · {collabs.filter((c) => c.status === "production" || c.status === "validation").length} en cours
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors">
          <Plus className="h-4 w-4" />
          Nouvelle collaboration
        </button>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                activeFilter === f.key
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une marque..."
            className="w-full sm:w-64 rounded-lg border border-border-subtle bg-bg-surface py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden"
      >
        {/* Table header */}
        <div className="hidden sm:grid sm:grid-cols-6 gap-4 px-5 py-3 border-b border-border-subtle text-[11px] text-text-muted uppercase tracking-wider">
          <span className="col-span-2">Marque</span>
          <span>Livrables</span>
          <span>Statut</span>
          <span>Deadline</span>
          <span className="text-right">Montant</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border-subtle">
          {filtered.map((c) => {
            const st = statusConfig[c.status] || statusConfig.lead;
            return (
              <div
                key={c.id}
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 items-center px-5 py-4 hover:bg-bg-elevated/50 transition-colors cursor-pointer"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full shrink-0 ${c.avatar}`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{c.brand}</p>
                    <p className="text-xs text-text-muted">{c.platform}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{c.deliverables}</p>
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`}>
                  {st.label}
                </span>
                <p className="text-sm text-text-secondary">{c.deadline}</p>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm font-medium text-text-primary">{c.amount}</span>
                  <button className="text-text-muted hover:text-text-primary">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-text-muted">
            Aucune collaboration trouvée.
          </div>
        )}
      </motion.div>
    </main>
  );
}
