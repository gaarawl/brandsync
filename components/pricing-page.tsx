"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Bot,
  FileDown,
  BarChart3,
  Shield,
  Zap,
  ArrowLeft,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: "0", yearly: "0" },
    description: "Pour d\u00E9couvrir BrandSync",
    features: [
      { text: "10 messages IA / jour", included: true },
      { text: "Gestion des marques", included: true },
      { text: "Gestion des collaborations", included: true },
      { text: "Calendrier & statistiques", included: true },
      { text: "Link-in-Bio public", included: true },
      { text: "5 emails / jour", included: true },
      { text: "200+ messages IA / jour", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Plan actuel",
    popular: false,
    tier: "free",
  },
  {
    name: "Pro",
    price: { monthly: "9.99", yearly: "7.99" },
    description: "Pour les cr\u00E9ateurs s\u00E9rieux",
    features: [
      { text: "200 messages IA / jour", included: true },
      { text: "50 emails / jour", included: true },
      { text: "Statistiques avanc\u00E9es", included: true },
      { text: "Assistant IA avanc\u00E9", included: true },
      { text: "Link-in-Bio avec analytics", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Nouvelles features en avant-premi\u00E8re", included: true },
    ],
    cta: "Commencer",
    popular: true,
    tier: "pro",
  },
  {
    name: "Business",
    price: { monthly: "50", yearly: "40" },
    description: "Pour les top cr\u00E9ateurs",
    features: [
      { text: "500 messages IA / jour", included: true },
      { text: "200 emails / jour", included: true },
      { text: "Tout le plan Pro inclus", included: true },
      { text: "50 destinataires / campagne", included: true },
      { text: "Support VIP prioritaire", included: true },
      { text: "Acc\u00E8s anticipé nouvelles features", included: true },
      { text: "Badge Cr\u00E9ateur V\u00E9rifi\u00E9", included: true },
    ],
    cta: "Passer Business",
    popular: false,
    tier: "business",
  },
];

const highlights = [
  { icon: Bot, text: "IA pour g\u00E9rer tes collabs" },
  { icon: FileDown, text: "Export PDF & CSV" },
  { icon: BarChart3, text: "Stats d\u00E9taill\u00E9es" },
  { icon: Shield, text: "Donn\u00E9es s\u00E9curis\u00E9es" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (tier: string) => {
    if (tier === "free") return;
    setLoading(true);

    let priceId: string;
    if (tier === "business") {
      priceId =
        billing === "monthly"
          ? process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID || ""
          : process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID || "";
    } else {
      priceId =
        billing === "monthly"
          ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ||
            "price_1TL3RuLVSEf30cSA5RBI6eKD"
          : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ||
            "price_1TL3RuLVSEf30cSAxbkyUNnN";
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Erreur lors de la redirection vers le paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Nav */}
      <nav className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold text-text-primary">
              BrandSync
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent mb-4">
            <Zap className="h-3.5 w-3.5" />
            Pricing simple et transparent
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            Choisis ton plan
          </h1>
          <p className="text-text-muted max-w-md mx-auto">
            Commence gratuitement, passe au Pro quand tu es pr&ecirc;t.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-10"
        >
          <div className="relative flex items-center gap-1 rounded-xl bg-bg-surface border border-border-subtle p-1">
            <button
              onClick={() => setBilling("monthly")}
              className="relative rounded-lg px-5 py-2 text-sm font-medium transition-colors z-10 text-text-primary"
            >
              {billing === "monthly" && (
                <motion.div
                  layoutId="billing-tab"
                  className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Mensuel</span>
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="relative rounded-lg px-5 py-2 text-sm font-medium transition-colors z-10 text-text-primary"
            >
              {billing === "yearly" && (
                <motion.div
                  layoutId="billing-tab"
                  className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                Annuel
                <span className="ml-2 rounded-full bg-green-500/15 text-green-400 px-2 py-0.5 text-[10px] font-medium">
                  -33%
                </span>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`relative rounded-2xl border p-7 ${
                plan.popular
                  ? "border-accent bg-bg-surface shadow-lg shadow-accent/5"
                  : plan.tier === "business"
                  ? "border-amber-500/50 bg-bg-surface shadow-lg shadow-amber-500/5"
                  : "border-border-subtle bg-bg-surface"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-medium text-bg-primary">
                  Le plus choisi
                </div>
              )}
              {plan.tier === "business" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-[11px] font-medium text-black">
                  Premium
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-4xl font-bold text-text-primary"
                    >
                      {plan.price[billing]}&euro;
                    </motion.span>
                  </AnimatePresence>
                  {plan.tier !== "free" && (
                    <span className="text-sm text-text-muted">/mois</span>
                  )}
                  {plan.tier === "pro" && billing === "monthly" && (
                    <span className="rounded-full bg-green-500/15 text-green-400 px-2.5 py-0.5 text-[10px] font-semibold">
                      -50% le 1er mois
                    </span>
                  )}
                  {plan.tier === "business" && billing === "monthly" && (
                    <span className="rounded-full bg-green-500/15 text-green-400 px-2.5 py-0.5 text-[10px] font-semibold">
                      -10% le 1er mois
                    </span>
                  )}
                  {plan.tier !== "free" && billing === "yearly" && (
                    <span className="rounded-full bg-green-500/15 text-green-400 px-2.5 py-0.5 text-[10px] font-semibold">
                      -20%
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {plan.tier === "pro" && billing === "monthly" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-green-400/80 mt-1"
                    >
                      4.99&euro; le premier mois, puis 9.99&euro;/mois
                    </motion.p>
                  )}
                  {plan.tier === "business" && billing === "monthly" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-green-400/80 mt-1"
                    >
                      45&euro; le premier mois, puis 50&euro;/mois
                    </motion.p>
                  )}
                  {plan.tier === "pro" && billing === "yearly" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-green-400/80 mt-1"
                    >
                      95.88&euro; au lieu de 119.88&euro;
                    </motion.p>
                  )}
                  {plan.tier === "business" && billing === "yearly" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-green-400/80 mt-1"
                    >
                      480&euro; au lieu de 600&euro;
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {plan.tier !== "free" ? (
                <button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading}
                  className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold mb-6 text-white disabled:opacity-50 ${
                    plan.tier === "business"
                      ? "bg-gradient-to-b from-[#f59e0b] to-[#d97706] shadow-[0_0_25px_rgba(245,158,11,0.4),0_0_60px_rgba(245,158,11,0.15)]"
                      : "bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.2)]"
                  }`}
                >
                  <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
                  <span className={`absolute -inset-2 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500 ${
                    plan.tier === "business" ? "bg-amber-500/25 group-hover:bg-amber-500/35" : "bg-accent/25 group-hover:bg-accent/35"
                  }`} />
                  <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">
                    {loading ? "Redirection..." : plan.cta}
                  </span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full rounded-xl py-3 text-sm font-medium mb-6 bg-bg-elevated text-text-secondary cursor-default"
                >
                  {plan.cta}
                </button>
              )}

              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className="h-4 w-4 text-green-400 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-text-muted/40 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        f.included ? "text-text-secondary" : "text-text-muted/50"
                      }`}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {highlights.map((h) => (
            <div
              key={h.text}
              className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface p-5 text-center"
            >
              <h.icon className="h-5 w-5 text-accent" />
              <span className="text-xs text-text-secondary">{h.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
