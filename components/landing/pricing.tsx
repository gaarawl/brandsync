"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Plan {
  name: string;
  price: { monthly: string; yearly: string };
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  href: string;
  popular?: boolean;
  tier: "free" | "pro" | "business";
}

const plans: Plan[] = [
  {
    name: "Free",
    price: { monthly: "0€", yearly: "0€" },
    period: "",
    description:
      "Pour découvrir la plateforme et structurer vos premières collaborations.",
    features: [
      { text: "Gestion des marques", included: true },
      { text: "Gestion des collaborations", included: true },
      { text: "Calendrier", included: true },
      { text: "Export PDF & CSV", included: true },
      { text: "10 messages IA / jour", included: true },
      { text: "Statistiques de base", included: true },
      { text: "200+ messages IA / jour", included: false },
      { text: "Sync Gmail auto", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
    tier: "free",
  },
  {
    name: "Pro",
    price: { monthly: "9.99€", yearly: "7.99€" },
    period: "/mois",
    description:
      "Pour les créateurs qui veulent un vrai cockpit business au quotidien.",
    features: [
      { text: "200 messages IA / jour", included: true },
      { text: "50 emails / jour", included: true },
      { text: "Statistiques avancées", included: true },
      { text: "Assistant IA avancé", included: true },
      { text: "Link-in-Bio avec analytics", included: true },
      { text: "Sync Gmail auto (toutes les 3h)", included: true },
      { text: "Détection collabs par email", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Nouvelles features en avant-première", included: true },
    ],
    cta: "Passer à Pro",
    href: "/pricing",
    popular: true,
    tier: "pro",
  },
  {
    name: "Business",
    price: { monthly: "50€", yearly: "40€" },
    period: "/mois",
    description:
      "Pour les top créateurs qui veulent tout automatiser.",
    features: [
      { text: "500 messages IA / jour", included: true },
      { text: "200 emails / jour", included: true },
      { text: "Tout le plan Pro inclus", included: true },
      { text: "Sync Gmail auto (toutes les 30min)", included: true },
      { text: "Détection collabs temps réel", included: true },
      { text: "50 destinataires / campagne", included: true },
      { text: "Support VIP prioritaire", included: true },
      { text: "Accès anticipé nouvelles features", included: true },
      { text: "Badge Créateur Vérifié", included: true },
    ],
    cta: "Passer Business",
    href: "/pricing",
    tier: "business",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      id="pricing"
      className="relative py-24 lg:py-32 border-t border-border-subtle"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Des plans pensés pour les créateurs"
          description="Commencez gratuitement, passez au Pro quand vous êtes prêt."
        />

        {/* Billing toggle */}
        <div className="flex items-center justify-center mt-10 mb-14">
          <div className="relative flex items-center gap-1 rounded-xl bg-bg-surface border border-border-subtle p-1">
            <button
              onClick={() => setBilling("monthly")}
              className="relative rounded-lg px-5 py-2 text-sm font-medium z-10 text-text-primary"
            >
              {billing === "monthly" && (
                <motion.div
                  layoutId="landing-billing-tab"
                  className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Mensuel</span>
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="relative rounded-lg px-5 py-2 text-sm font-medium z-10 text-text-primary"
            >
              {billing === "yearly" && (
                <motion.div
                  layoutId="landing-billing-tab"
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
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                "relative rounded-2xl border p-8 space-y-6",
                plan.popular
                  ? "border-accent/30 bg-bg-surface glow-accent"
                  : plan.tier === "business"
                  ? "border-amber-500/50 bg-bg-surface shadow-lg shadow-amber-500/5"
                  : "border-border-subtle bg-bg-surface"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-bg-primary">
                  Le plus choisi
                </span>
              )}
              {plan.tier === "business" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-black">
                  Premium
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="text-4xl font-extrabold text-text-primary"
                    >
                      {plan.price[billing]}
                    </motion.span>
                  </AnimatePresence>
                  {plan.period && (
                    <span className="text-sm text-text-muted">
                      {plan.period}
                    </span>
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
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat.text} className="flex items-start gap-3">
                    {feat.included ? (
                      <Check className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.tier === "business" ? "text-amber-400" : "text-accent"
                      )} />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-text-muted/40" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feat.included
                          ? "text-text-secondary"
                          : "text-text-muted/50"
                      )}
                    >
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.tier === "pro" ? (
                <Link
                  href={plan.href}
                  className="group relative block w-full overflow-hidden rounded-xl py-3.5 text-center text-sm font-semibold bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.2)]"
                >
                  <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
                  <span className="absolute -inset-2 rounded-2xl bg-accent/25 blur-xl opacity-70 group-hover:opacity-100 group-hover:bg-accent/35 transition-all duration-500" />
                  <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">{plan.cta}</span>
                </Link>
              ) : plan.tier === "business" ? (
                <Link
                  href={plan.href}
                  className="group relative block w-full overflow-hidden rounded-xl py-3.5 text-center text-sm font-semibold bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white shadow-[0_0_25px_rgba(245,158,11,0.4),0_0_60px_rgba(245,158,11,0.15)]"
                >
                  <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
                  <span className="absolute -inset-2 rounded-2xl bg-amber-500/25 blur-xl opacity-70 group-hover:opacity-100 group-hover:bg-amber-500/35 transition-all duration-500" />
                  <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">{plan.cta}</span>
                </Link>
              ) : (
                <Link
                  href={plan.href}
                  className="block w-full rounded-xl py-3.5 text-center text-sm font-medium bg-bg-elevated text-text-secondary hover:bg-bg-primary transition-colors border border-border-subtle"
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
