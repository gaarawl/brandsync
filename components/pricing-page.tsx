"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
      { text: "Calendrier", included: true },
      { text: "Export PDF", included: true },
      { text: "Export CSV", included: true },
      { text: "Statistiques de base", included: true },
      { text: "200 messages IA / jour", included: false },
      { text: "Statistiques avanc\u00E9es", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Plan actuel",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: "9.99", yearly: "6.66" },
    description: "Pour les cr\u00E9ateurs s\u00E9rieux",
    features: [
      { text: "200 messages IA / jour", included: true },
      { text: "Gestion des marques", included: true },
      { text: "Gestion des collaborations", included: true },
      { text: "Calendrier", included: true },
      { text: "Export PDF", included: true },
      { text: "Export CSV", included: true },
      { text: "Statistiques avanc\u00E9es", included: true },
      { text: "Assistant IA avanc\u00E9", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Nouvelles fonctionnalit\u00E9s en avant-premi\u00E8re", included: true },
    ],
    cta: "Commencer",
    popular: true,
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

  const handleSubscribe = async (plan: string) => {
    if (plan === "Free") return;
    setLoading(true);

    const priceId =
      billing === "monthly"
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ||
          "price_1TL3RuLVSEf30cSA5RBI6eKD"
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ||
          "price_1TL3RuLVSEf30cSAxbkyUNnN";

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
          className="flex items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              billing === "monthly"
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              billing === "yearly"
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Annuel
            <span className="ml-2 rounded-full bg-green-500/15 text-green-400 px-2 py-0.5 text-[10px] font-medium">
              -33%
            </span>
          </button>
        </motion.div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`relative rounded-2xl border p-7 ${
                plan.popular
                  ? "border-accent bg-bg-surface shadow-lg shadow-accent/5"
                  : "border-border-subtle bg-bg-surface"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-medium text-bg-primary">
                  Populaire
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">
                    {plan.price[billing]}&euro;
                  </span>
                  {plan.name !== "Free" && (
                    <span className="text-sm text-text-muted">/mois</span>
                  )}
                </div>
                {plan.name === "Pro" && billing === "yearly" && (
                  <p className="text-xs text-text-muted mt-1">
                    Factur&eacute; 79.90&euro;/an
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.name === "Free" || loading}
                className={`w-full rounded-xl py-3 text-sm font-medium transition-colors mb-6 ${
                  plan.popular
                    ? "bg-accent text-bg-primary hover:bg-accent-glow"
                    : "bg-bg-elevated text-text-secondary cursor-default"
                } disabled:opacity-50`}
              >
                {loading && plan.popular ? "Redirection..." : plan.cta}
              </button>

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
