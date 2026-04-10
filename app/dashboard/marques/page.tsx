"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Building2, Mail, ExternalLink } from "lucide-react";

const brands = [
  {
    name: "UGC Factory",
    contact: "Sarah Martin",
    email: "sarah@ugcfactory.com",
    campaigns: 5,
    totalRevenue: "6 400 €",
    status: "Actif",
    paymentDelay: "30 jours",
    notes: "Très réactif, briefs détaillés. Préfère TikTok.",
    avatar: "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  },
  {
    name: "Glow Beauty",
    contact: "Julie Chen",
    email: "julie@glowbeauty.fr",
    campaigns: 3,
    totalRevenue: "3 200 €",
    status: "Actif",
    paymentDelay: "45 jours",
    notes: "Budget moyen. Demande beaucoup de retouches.",
    avatar: "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  },
  {
    name: "TechNova",
    contact: "Marc Dubois",
    email: "marc@technova.io",
    campaigns: 1,
    totalRevenue: "2 800 €",
    status: "En cours",
    paymentDelay: "60 jours",
    notes: "Premier deal. Gros budget potentiel pour Q3.",
    avatar: "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  },
  {
    name: "Summer Campaign",
    contact: "Léa Fontaine",
    email: "lea@summercampaign.com",
    campaigns: 2,
    totalRevenue: "4 800 €",
    status: "Actif",
    paymentDelay: "30 jours",
    notes: "Agence. Plusieurs marques en sous-traitance.",
    avatar: "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  },
  {
    name: "FitLab Pro",
    contact: "Karim Benzar",
    email: "karim@fitlabpro.com",
    campaigns: 0,
    totalRevenue: "0 €",
    status: "Nouveau",
    paymentDelay: "—",
    notes: "Contact via DM Instagram. À qualifier.",
    avatar: "bg-gradient-to-br from-violet-500/40 to-indigo-500/40",
  },
  {
    name: "CloudFit",
    contact: "Emma Rossi",
    email: "emma@cloudfit.co",
    campaigns: 2,
    totalRevenue: "5 600 €",
    status: "Actif",
    paymentDelay: "30 jours",
    notes: "Sponsor YouTube long terme. Très bon partenaire.",
    avatar: "bg-gradient-to-br from-sky-500/40 to-blue-500/40",
  },
];

export default function MarquesPage() {
  const [search, setSearch] = useState("");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Marques</h1>
          <p className="text-sm text-text-muted mt-1">
            {brands.length} marques · {brands.filter((b) => b.status === "Actif").length} actives
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter une marque
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une marque..."
          className="w-full sm:w-80 rounded-lg border border-border-subtle bg-bg-surface py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50"
        />
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5 hover:border-border-medium transition-colors cursor-pointer space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full shrink-0 ${brand.avatar}`} />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{brand.name}</h3>
                  <p className="text-xs text-text-muted">{brand.contact}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  brand.status === "Actif"
                    ? "bg-green-500/15 text-green-400"
                    : brand.status === "Nouveau"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                {brand.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-bg-primary p-2.5 text-center border border-border-subtle">
                <p className="text-base font-bold text-text-primary">{brand.campaigns}</p>
                <p className="text-[10px] text-text-muted">Campagnes</p>
              </div>
              <div className="rounded-lg bg-bg-primary p-2.5 text-center border border-border-subtle">
                <p className="text-base font-bold text-text-primary">{brand.totalRevenue}</p>
                <p className="text-[10px] text-text-muted">Revenus</p>
              </div>
              <div className="rounded-lg bg-bg-primary p-2.5 text-center border border-border-subtle">
                <p className="text-base font-bold text-text-primary">{brand.paymentDelay}</p>
                <p className="text-[10px] text-text-muted">Délai paie.</p>
              </div>
            </div>

            {/* Notes */}
            <p className="text-xs text-text-secondary leading-relaxed">{brand.notes}</p>

            {/* Contact */}
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{brand.email}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-text-muted">
          Aucune marque trouvée.
        </div>
      )}
    </main>
  );
}
