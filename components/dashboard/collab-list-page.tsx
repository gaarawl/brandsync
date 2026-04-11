"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Trash2,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import {
  createCollaboration,
  updateCollaboration,
  deleteCollaboration,
} from "@/lib/actions/collaborations";

type Brand = {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  notes: string | null;
  paymentDelay: string | null;
  status: string;
  _count: { collaborations: number; payments: number };
};

type Collaboration = {
  id: string;
  platform: string;
  deliverables: string;
  status: string;
  deadline: Date | null;
  amount: number;
  notes: string | null;
  brandId: string;
  brand: {
    id: string;
    name: string;
  };
};

type StatusFilter =
  | "all"
  | "lead"
  | "negotiation"
  | "production"
  | "invoiced"
  | "paid";

const statusConfig: Record<string, { label: string; color: string }> = {
  lead: { label: "Nouveau lead", color: "bg-blue-500/15 text-blue-400" },
  negotiation: {
    label: "Négociation",
    color: "bg-orange-500/15 text-orange-400",
  },
  production: {
    label: "En production",
    color: "bg-green-500/15 text-green-400",
  },
  validation: {
    label: "En attente",
    color: "bg-yellow-500/15 text-yellow-400",
  },
  invoiced: { label: "Facturée", color: "bg-accent/15 text-accent" },
  paid: { label: "Payé", color: "bg-emerald-500/15 text-emerald-400" },
};

const filters: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "lead", label: "Leads" },
  { key: "negotiation", label: "Négociation" },
  { key: "production", label: "Production" },
  { key: "invoiced", label: "Facturées" },
  { key: "paid", label: "Payées" },
];

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

const inputClass =
  "mt-1 w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50";

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CollabListPage({
  collaborations,
  brands,
}: {
  collaborations: Collaboration[];
  brands: Brand[];
}) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCollab, setEditCollab] = useState<Collaboration | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = collaborations.filter((c) => {
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    const matchSearch = c.brand.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeCount = collaborations.filter(
    (c) => c.status === "production" || c.status === "validation"
  ).length;

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createCollaboration(formData);
      setShowModal(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editCollab) return;
    startTransition(async () => {
      await updateCollaboration(editCollab.id, formData);
      setEditCollab(null);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cette collaboration ?")) return;
    startTransition(() => deleteCollaboration(id));
    setMenuOpen(null);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Collaborations
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {collaborations.length} collaborations &middot; {activeCount} en
            cours
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors"
        >
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
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 items-center px-5 py-4 hover:bg-bg-elevated/50 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full shrink-0 ${getAvatarColor(c.brand.name)}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {c.brand.name}
                    </p>
                    <p className="text-xs text-text-muted">{c.platform}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{c.deliverables}</p>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`}
                >
                  {st.label}
                </span>
                <p className="text-sm text-text-secondary">
                  {formatDate(c.deadline)}
                </p>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm font-medium text-text-primary">
                    {c.amount.toLocaleString("fr-FR")} &euro;
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === c.id ? null : c.id)
                      }
                      className="text-text-muted hover:text-text-primary"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen === c.id && (
                      <div className="absolute right-0 top-6 z-10 w-36 rounded-lg border border-border-subtle bg-bg-surface py-1 shadow-xl">
                        <button
                          onClick={() => {
                            setEditCollab(c);
                            setMenuOpen(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-bg-elevated"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-text-muted">
            {collaborations.length === 0
              ? "Aucune collaboration. Créez votre première !"
              : "Aucune collaboration trouvée."}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <CollabModal
            title="Nouvelle collaboration"
            brands={brands}
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editCollab && (
          <CollabModal
            title="Modifier la collaboration"
            brands={brands}
            collab={editCollab}
            onClose={() => setEditCollab(null)}
            onSubmit={handleUpdate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function CollabModal({
  title,
  brands,
  collab,
  onClose,
  onSubmit,
  isPending,
}: {
  title: string;
  brands: Brand[];
  collab?: Collaboration;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  const deadlineDefault = collab?.deadline
    ? new Date(collab.deadline).toISOString().split("T")[0]
    : "";

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
        className="w-full max-w-md rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-4 max-h-[90vh] overflow-y-auto"
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
          {/* Brand select (only for creation) */}
          {!collab && (
            <div>
              <label className="text-xs text-text-muted">Marque *</label>
              <select name="brandId" required className={inputClass}>
                <option value="">S&eacute;lectionnez une marque</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {brands.length === 0 && (
                <p className="mt-1 text-xs text-yellow-400">
                  Ajoutez d&apos;abord une marque dans l&apos;onglet Marques.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Plateforme *</label>
              <select
                name="platform"
                defaultValue={collab?.platform || ""}
                required
                className={inputClass}
              >
                <option value="">Choisir</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Twitter">Twitter</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted">Statut</label>
              <select
                name="status"
                defaultValue={collab?.status || "lead"}
                className={inputClass}
              >
                <option value="lead">Nouveau lead</option>
                <option value="negotiation">N&eacute;gociation</option>
                <option value="production">En production</option>
                <option value="validation">En attente</option>
                <option value="invoiced">Factur&eacute;e</option>
                <option value="paid">Pay&eacute;</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Livrables *</label>
            <input
              name="deliverables"
              defaultValue={collab?.deliverables || ""}
              required
              placeholder="ex: 3 vidéos TikTok"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">
                Montant (&euro;)
              </label>
              <input
                name="amount"
                type="number"
                defaultValue={collab?.amount || 0}
                min={0}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Deadline</label>
              <input
                name="deadline"
                type="date"
                defaultValue={deadlineDefault}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Notes</label>
            <textarea
              name="notes"
              defaultValue={collab?.notes || ""}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : collab ? "Enregistrer" : "Créer"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
