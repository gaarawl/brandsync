"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  createBrandAndReturn,
} from "@/lib/actions/brands";
import {
  createCollaborationFromParsed,
} from "@/lib/actions/collaborations";
import Link from "next/link";

type ParsedBrief = {
  brandName: string | null;
  brandEmail: string | null;
  brandContact: string | null;
  platform: string | null;
  deliverables: string | null;
  amount: number | null;
  deadline: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
};

const platformOptions = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Snapchat",
  "Twitter",
  "Autre",
];

const confidenceConfig = {
  high: {
    label: "Confiance élevée",
    color: "bg-green-500/15 text-green-400",
  },
  medium: {
    label: "Confiance moyenne",
    color: "bg-yellow-500/15 text-yellow-400",
  },
  low: {
    label: "Confiance faible",
    color: "bg-red-500/15 text-red-400",
  },
};

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50 transition-colors";

export default function AIBriefParser() {
  const [briefText, setBriefText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandContact, setBrandContact] = useState("");
  const [platform, setPlatform] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const analyze = async () => {
    if (!briefText.trim() || loading) return;
    setLoading(true);
    setError(null);
    setParsed(null);
    setCreated(false);

    try {
      const res = await fetch("/api/ai/brief-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefText: briefText.trim() }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();

      if (data.parsed) {
        const p = data.parsed as ParsedBrief;
        setParsed(p);
        setBrandName(p.brandName || "");
        setBrandEmail(p.brandEmail || "");
        setBrandContact(p.brandContact || "");
        setPlatform(p.platform || "Autre");
        setDeliverables(p.deliverables || "");
        setAmount(p.amount ? String(p.amount) : "");
        setDeadline(p.deadline || "");
        setNotes(p.notes || "");
      } else {
        setError(
          "L'IA n'a pas pu analyser ce brief. Vérifie le texte et réessaie."
        );
      }
    } catch {
      setError("Une erreur est survenue. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!brandName || !platform || !deliverables || creating) return;
    setCreating(true);
    setError(null);

    try {
      const brand = await createBrandAndReturn({
        name: brandName,
        contact: brandContact || null,
        email: brandEmail || null,
      });

      await createCollaborationFromParsed({
        brandId: brand.id,
        platform,
        deliverables,
        amount: parseInt(amount) || 0,
        deadline: deadline || null,
        notes: notes || null,
      });

      setCreated(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur lors de la création."
      );
    } finally {
      setCreating(false);
    }
  };

  const reset = () => {
    setBriefText("");
    setParsed(null);
    setError(null);
    setCreated(false);
    setBrandName("");
    setBrandEmail("");
    setBrandContact("");
    setPlatform("");
    setDeliverables("");
    setAmount("");
    setDeadline("");
    setNotes("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success state */}
        {created && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">
              Collaboration créée !
            </h2>
            <p className="text-sm text-text-muted mb-6">
              La collaboration avec <strong>{brandName}</strong> a été ajoutée
              en statut &quot;Nouveau lead&quot;.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/dashboard/collaborations"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors"
              >
                Voir mes collaborations
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Analyser un autre brief
              </button>
            </div>
          </motion.div>
        )}

        {/* Input + Parse flow */}
        {!created && (
          <>
            {/* Header */}
            {!parsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-3">
                  <Sparkles className="h-7 w-7 text-accent" />
                </div>
                <h2 className="text-lg font-bold text-text-primary">
                  Analyseur de brief
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Colle un email ou brief de marque, l&apos;IA crée la collab
                  pour toi
                </p>
              </motion.div>
            )}

            {/* Textarea */}
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted mb-2 block">
                  {parsed
                    ? "Brief original"
                    : "Colle ici le brief ou l'email de la marque"}
                </label>
                <textarea
                  value={briefText}
                  onChange={(e) => setBriefText(e.target.value)}
                  rows={parsed ? 4 : 10}
                  placeholder="Bonjour, nous sommes la marque XYZ et nous aimerions collaborer avec vous pour une campagne Instagram. Nous recherchons 2 reels et 3 stories. Budget : 800€. Deadline : 15 mai..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {!parsed && (
                <button
                  onClick={analyze}
                  disabled={!briefText.trim() || loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyser le brief
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Parsed result - editable form */}
            {parsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Confidence badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">
                    Informations extraites
                  </h3>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${confidenceConfig[parsed.confidence].color}`}
                  >
                    {parsed.confidence !== "high" && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {confidenceConfig[parsed.confidence].label}
                  </span>
                </div>

                <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-4">
                  {/* Brand info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-text-muted">
                        Marque *
                      </label>
                      <input
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">
                        Contact
                      </label>
                      <input
                        value={brandContact}
                        onChange={(e) => setBrandContact(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">Email</label>
                      <input
                        value={brandEmail}
                        onChange={(e) => setBrandEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Collab info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted">
                        Plateforme *
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className={inputClass}
                      >
                        {platformOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">
                        Livrables *
                      </label>
                      <input
                        value={deliverables}
                        onChange={(e) => setDeliverables(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted">
                        Montant (&euro;)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCreate}
                    disabled={
                      !brandName || !platform || !deliverables || creating
                    }
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Créer la collaboration
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setParsed(null);
                      setError(null);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Ré-analyser
                  </button>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
