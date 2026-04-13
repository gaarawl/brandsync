"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Copy, Check, RefreshCw } from "lucide-react";

type RateItem = { type: string; price: number; description: string };
type RateResult = {
  rates: RateItem[];
  notes: string;
  range: { min: number; max: number };
};

const platforms = ["Instagram", "TikTok", "YouTube", "Snapchat", "Twitter"];
const niches = [
  "Mode",
  "Beauté",
  "Tech",
  "Finance",
  "Lifestyle",
  "Food",
  "Sport",
  "Voyage",
  "Humour",
  "Éducation",
  "Musique",
  "Gaming",
  "Autre",
];

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50 transition-colors";

export default function AIRateCard() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const canGenerate =
    selectedPlatforms.length > 0 && followers && engagement && niche;

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/rate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          followers: parseInt(followers.replace(/\D/g, "")),
          engagementRate: parseFloat(engagement),
          niche,
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();

      if (data.rates?.rates) {
        setResult(data.rates);
      } else if (data.raw) {
        setError("L'IA n'a pas pu générer un format valide. Réessaie.");
      }
    } catch {
      setError("Une erreur est survenue. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = [
      `MES TARIFS — ${niche} | ${parseInt(followers.replace(/\D/g, "")).toLocaleString("fr-FR")} abonnés | ${engagement}% engagement`,
      "",
      ...result.rates.map(
        (r) => `${r.type} — ${r.price.toLocaleString("fr-FR")}€\n  ${r.description}`
      ),
      "",
      `Note : ${result.notes}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Form */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 mb-3">
                <Sparkles className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">
                Générateur de tarifs
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Entre tes stats, l&apos;IA te propose des prix adaptés au marché
              </p>
            </div>

            <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-5">
              {/* Platforms */}
              <div>
                <label className="text-xs font-medium text-text-muted mb-2 block">
                  Plateformes *
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                        selectedPlatforms.includes(p)
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "bg-bg-primary border border-border-subtle text-text-secondary hover:border-border-medium"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Followers + Engagement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1 block">
                    Abonnés *
                  </label>
                  <input
                    type="text"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="ex: 50000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1 block">
                    Taux d&apos;engagement (%) *
                  </label>
                  <input
                    type="text"
                    value={engagement}
                    onChange={(e) => setEngagement(e.target.value)}
                    placeholder="ex: 3.5"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Niche */}
              <div>
                <label className="text-xs font-medium text-text-muted mb-1 block">
                  Niche *
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sélectionner</option>
                  {niches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate */}
              <button
                onClick={generate}
                disabled={!canGenerate || loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Générer mes tarifs
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header card */}
            <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-text-primary">
                  Tes tarifs estimés
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-elevated transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copier
                      </>
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-elevated transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Refaire
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                {selectedPlatforms.join(", ")} &middot;{" "}
                {parseInt(followers.replace(/\D/g, "")).toLocaleString("fr-FR")}{" "}
                abonnés &middot; {engagement}% engagement &middot; {niche}
              </p>
            </div>

            {/* Price range */}
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-border-subtle bg-bg-surface p-4 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">
                  Min
                </p>
                <p className="text-xl font-bold text-text-primary mt-1">
                  {result.range.min.toLocaleString("fr-FR")}&euro;
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
                <p className="text-[10px] text-accent uppercase tracking-wider">
                  Max
                </p>
                <p className="text-xl font-bold text-accent mt-1">
                  {result.range.max.toLocaleString("fr-FR")}&euro;
                </p>
              </div>
            </div>

            {/* Rates grid */}
            <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-3 gap-4 px-5 py-3 border-b border-border-subtle text-[11px] text-text-muted uppercase tracking-wider">
                <span>Type de contenu</span>
                <span>Tarif</span>
                <span>Description</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {result.rates.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      {r.type}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      {r.price.toLocaleString("fr-FR")}&euro;
                    </p>
                    <p className="text-xs text-text-muted">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
              <p className="text-xs text-text-muted leading-relaxed">
                {result.notes}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
