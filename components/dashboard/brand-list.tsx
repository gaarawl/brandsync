"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Mail, X, Trash2, Pencil, Upload, Download } from "lucide-react";
import { createBrand, updateBrand, deleteBrand } from "@/lib/actions/brands";
import { exportCsv, parseCsv } from "@/lib/csv";

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
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const inputClass =
  "mt-1 w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50";

export default function BrandList({ brands }: { brands: Brand[] }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createBrand(formData);
      setShowModal(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editBrand) return;
    startTransition(async () => {
      await updateBrand(editBrand.id, formData);
      setEditBrand(null);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cette marque ?")) return;
    startTransition(() => deleteBrand(id));
  };

  const handleExportCsv = () => {
    const headers = ["Nom", "Contact", "Email", "Statut", "Délai de paiement", "Notes"];
    const rows = brands.map((b) => [
      b.name,
      b.contact || "",
      b.email || "",
      b.status,
      b.paymentDelay || "",
      b.notes || "",
    ]);
    exportCsv(headers, rows, "marques.csv");
  };

  const handleImportCsv = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const rows = parseCsv(text);
      let imported = 0;
      for (const row of rows) {
        const name = row["Nom"] || row["name"] || row["Name"];
        if (!name) continue;
        const fd = new FormData();
        fd.set("name", name);
        fd.set("contact", row["Contact"] || row["contact"] || "");
        fd.set("email", row["Email"] || row["email"] || "");
        fd.set("notes", row["Notes"] || row["notes"] || "");
        fd.set("paymentDelay", row["Délai de paiement"] || row["paymentDelay"] || "");
        await createBrand(fd);
        imported++;
      }
      if (imported > 0) alert(`${imported} marque(s) importée(s) !`);
    };
    input.click();
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Marques</h1>
          <p className="text-sm text-text-muted mt-1">
            {brands.length} marques &middot;{" "}
            {brands.filter((b) => b.status === "Actif").length} actives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportCsv}
            className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors"
          >
            <Upload className="h-4 w-4" />
            Importer
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter une marque
          </button>
        </div>
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
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5 hover:border-border-medium transition-colors space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full shrink-0 ${getAvatarColor(brand.name)}`}
                />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {brand.contact || "—"}
                  </p>
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
                <p className="text-base font-bold text-text-primary">
                  {brand._count.collaborations}
                </p>
                <p className="text-[10px] text-text-muted">Collabs</p>
              </div>
              <div className="rounded-lg bg-bg-primary p-2.5 text-center border border-border-subtle">
                <p className="text-base font-bold text-text-primary">
                  {brand._count.payments}
                </p>
                <p className="text-[10px] text-text-muted">Paiements</p>
              </div>
              <div className="rounded-lg bg-bg-primary p-2.5 text-center border border-border-subtle">
                <p className="text-base font-bold text-text-primary">
                  {brand.paymentDelay || "—"}
                </p>
                <p className="text-[10px] text-text-muted">Délai paie.</p>
              </div>
            </div>

            {/* Notes */}
            <p className="text-xs text-text-secondary leading-relaxed">
              {brand.notes || "Aucune note."}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{brand.email || "—"}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditBrand(brand)}
                  className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-text-muted">
          {brands.length === 0
            ? "Aucune marque. Ajoutez votre première marque !"
            : "Aucune marque trouvée."}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <BrandModal
            title="Ajouter une marque"
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editBrand && (
          <BrandModal
            title="Modifier la marque"
            brand={editBrand}
            onClose={() => setEditBrand(null)}
            onSubmit={handleUpdate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function BrandModal({
  title,
  brand,
  onClose,
  onSubmit,
  isPending,
}: {
  title: string;
  brand?: Brand;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
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
            <label className="text-xs text-text-muted">Nom *</label>
            <input
              name="name"
              defaultValue={brand?.name}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Contact</label>
              <input
                name="contact"
                defaultValue={brand?.contact || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={brand?.email || ""}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">
                D&eacute;lai de paiement
              </label>
              <input
                name="paymentDelay"
                defaultValue={brand?.paymentDelay || ""}
                placeholder="ex: 30 jours"
                className={inputClass}
              />
            </div>
            {brand && (
              <div>
                <label className="text-xs text-text-muted">Statut</label>
                <select
                  name="status"
                  defaultValue={brand.status}
                  className={inputClass}
                >
                  <option value="Actif">Actif</option>
                  <option value="En cours">En cours</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-text-muted">Notes</label>
            <textarea
              name="notes"
              defaultValue={brand?.notes || ""}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : brand ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
