"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Trash2,
  Pencil,
  MoreHorizontal,
  Download,
  Upload,
} from "lucide-react";
import {
  createPayment,
  updatePayment,
  deletePayment,
} from "@/lib/actions/payments";
import { generateInvoicePDF } from "@/lib/generate-invoice";
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

type Collab = {
  id: string;
  platform: string;
  deliverables: string;
  brandId: string;
  brand: { id: string; name: string };
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  invoiceDate: Date | null;
  dueDate: Date | null;
  paidDate: Date | null;
  brandId: string;
  collaborationId: string | null;
  brand: { id: string; name: string };
  collaboration: { id: string; deliverables: string; platform: string } | null;
};

type FilterType = "all" | "paid" | "pending" | "overdue";

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

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const inputClass =
  "mt-1 w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50";

export default function PaymentsPage({
  payments,
  brands,
  collaborations,
}: {
  payments: Payment[];
  brands: Brand[];
  collaborations: Collab[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showModal, setShowModal] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = payments.filter(
    (p) => activeFilter === "all" || p.status === activeFilter
  );

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments
    .filter((p) => p.status === "overdue")
    .reduce((s, p) => s + p.amount, 0);

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      await createPayment(formData);
      setShowModal(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editPayment) return;
    startTransition(async () => {
      await updatePayment(editPayment.id, formData);
      setEditPayment(null);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce paiement ?")) return;
    startTransition(() => deletePayment(id));
    setMenuOpen(null);
  };

  const handleExportCsv = () => {
    const headers = ["Marque", "Montant", "Statut", "Date facture", "Date échéance", "Date paiement"];
    const rows = payments.map((p) => [
      p.brand.name,
      String(p.amount),
      p.status,
      p.invoiceDate ? new Date(p.invoiceDate).toISOString().split("T")[0] : "",
      p.dueDate ? new Date(p.dueDate).toISOString().split("T")[0] : "",
      p.paidDate ? new Date(p.paidDate).toISOString().split("T")[0] : "",
    ]);
    exportCsv(headers, rows, "paiements.csv");
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
        const brandName = row["Marque"] || row["brand"] || row["Brand"];
        const brand = brands.find((b) => b.name.toLowerCase() === brandName?.toLowerCase());
        if (!brand) continue;
        const fd = new FormData();
        fd.set("brandId", brand.id);
        fd.set("amount", row["Montant"] || row["amount"] || "0");
        fd.set("status", row["Statut"] || row["status"] || "pending");
        fd.set("invoiceDate", row["Date facture"] || row["invoiceDate"] || "");
        fd.set("dueDate", row["Date échéance"] || row["dueDate"] || "");
        fd.set("paidDate", row["Date paiement"] || row["paidDate"] || "");
        await createPayment(fd);
        imported++;
      }
      if (imported > 0) alert(`${imported} paiement(s) importé(s) !`);
      else alert("Aucun paiement importé. Vérifiez que les noms de marques correspondent.");
    };
    input.click();
  };

  const handleExportPDF = (p: Payment) => {
    const doc = generateInvoicePDF({
      invoiceNumber: `INV-${p.id.slice(-6).toUpperCase()}`,
      date: p.invoiceDate
        ? new Date(p.invoiceDate).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR"),
      dueDate: p.dueDate
        ? new Date(p.dueDate).toLocaleDateString("fr-FR")
        : "—",
      from: { name: "Mon entreprise", email: "" },
      to: { name: p.brand.name, email: "" },
      items: [
        {
          description: p.collaboration
            ? p.collaboration.deliverables
            : "Prestation",
          platform: p.collaboration ? p.collaboration.platform : "—",
          amount: p.amount,
        },
      ],
      total: p.amount,
      status: p.status,
    });
    doc.save(`facture-${p.brand.name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    setMenuOpen(null);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Paiements</h1>
          <p className="text-sm text-text-muted mt-1">
            Suivi de vos factures et paiements
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
            Nouveau paiement
          </button>
        </div>
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
              <p className="text-[11px] text-text-muted uppercase tracking-wider">
                Re&ccedil;us
              </p>
              <p className="text-xl font-bold text-text-primary">
                {totalPaid.toLocaleString("fr-FR")} &euro;
              </p>
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
              <p className="text-[11px] text-text-muted uppercase tracking-wider">
                En attente
              </p>
              <p className="text-xl font-bold text-text-primary">
                {totalPending.toLocaleString("fr-FR")} &euro;
              </p>
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
              <p className="text-[11px] text-text-muted uppercase tracking-wider">
                En retard
              </p>
              <p className="text-xl font-bold text-text-primary">
                {totalOverdue.toLocaleString("fr-FR")} &euro;
              </p>
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
          <span className="col-span-2">Marque / Collab</span>
          <span>Montant</span>
          <span>Statut</span>
          <span>Date facture</span>
          <span>&Eacute;ch&eacute;ance</span>
        </div>

        <div className="divide-y divide-border-subtle">
          {filtered.map((p) => {
            const st = statusConfig[p.status] || statusConfig.pending;
            return (
              <div
                key={p.id}
                className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 items-center px-5 py-4 hover:bg-bg-elevated/50 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full shrink-0 ${getAvatarColor(p.brand.name)}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {p.brand.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {p.collaboration
                        ? `${p.collaboration.platform} · ${p.collaboration.deliverables}`
                        : "—"}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {p.amount.toLocaleString("fr-FR")} &euro;
                </p>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${st.color}`}
                >
                  {st.label}
                </span>
                <p className="text-sm text-text-secondary">
                  {formatDate(p.invoiceDate)}
                </p>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-text-secondary">
                    {formatDate(p.dueDate)}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === p.id ? null : p.id)
                      }
                      className="text-text-muted hover:text-text-primary"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen === p.id && (
                      <div className="absolute right-0 top-6 z-10 w-36 rounded-lg border border-border-subtle bg-bg-surface py-1 shadow-xl">
                        <button
                          onClick={() => {
                            setEditPayment(p);
                            setMenuOpen(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Modifier
                        </button>
                        <button
                          onClick={() => handleExportPDF(p)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated"
                        >
                          <Download className="h-3.5 w-3.5" /> Export PDF
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
            {payments.length === 0
              ? "Aucun paiement. Ajoutez votre premier !"
              : "Aucun paiement trouvé."}
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <PaymentModal
            title="Nouveau paiement"
            brands={brands}
            collaborations={collaborations}
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editPayment && (
          <PaymentModal
            title="Modifier le paiement"
            brands={brands}
            collaborations={collaborations}
            payment={editPayment}
            onClose={() => setEditPayment(null)}
            onSubmit={handleUpdate}
            isPending={isPending}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function PaymentModal({
  title,
  brands,
  collaborations,
  payment,
  onClose,
  onSubmit,
  isPending,
}: {
  title: string;
  brands: Brand[];
  collaborations: Collab[];
  payment?: Payment;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  const [selectedBrand, setSelectedBrand] = useState(payment?.brandId || "");

  const brandCollabs = collaborations.filter(
    (c) => c.brandId === selectedBrand
  );

  const dateStr = (d: Date | null) =>
    d ? new Date(d).toISOString().split("T")[0] : "";

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
          {!payment && (
            <>
              <div>
                <label className="text-xs text-text-muted">Marque *</label>
                <select
                  name="brandId"
                  required
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className={inputClass}
                >
                  <option value="">S&eacute;lectionnez</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              {brandCollabs.length > 0 && (
                <div>
                  <label className="text-xs text-text-muted">
                    Collaboration (optionnel)
                  </label>
                  <select name="collaborationId" className={inputClass}>
                    <option value="">Aucune</option>
                    {brandCollabs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.platform} &middot; {c.deliverables}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">
                Montant (&euro;) *
              </label>
              <input
                name="amount"
                type="number"
                defaultValue={payment?.amount || ""}
                required
                min={1}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Statut</label>
              <select
                name="status"
                defaultValue={payment?.status || "pending"}
                className={inputClass}
              >
                <option value="pending">En attente</option>
                <option value="paid">Pay&eacute;</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted">Date facture</label>
              <input
                name="invoiceDate"
                type="date"
                defaultValue={dateStr(payment?.invoiceDate ?? null)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">
                &Eacute;ch&eacute;ance
              </label>
              <input
                name="dueDate"
                type="date"
                defaultValue={dateStr(payment?.dueDate ?? null)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Date de paiement</label>
            <input
              name="paidDate"
              type="date"
              defaultValue={dateStr(payment?.paidDate ?? null)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : payment ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
