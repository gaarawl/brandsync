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
}

const plans: Plan[] = [
  {
    name: "Free",
    price: { monthly: "0\u20AC", yearly: "0\u20AC" },
    period: "",
    description:
      "Pour d\u00E9couvrir la plateforme et structurer vos premi\u00E8res collaborations.",
    features: [
      { text: "Gestion des marques", included: true },
      { text: "Gestion des collaborations", included: true },
      { text: "Calendrier", included: true },
      { text: "Export PDF & CSV", included: true },
      { text: "10 messages IA / jour", included: true },
      { text: "Statistiques de base", included: true },
      { text: "200 messages IA / jour", included: false },
      { text: "Statistiques avanc\u00E9es", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
  },
  {
    name: "Pro",
    price: { monthly: "9.99\u20AC", yearly: "6.66\u20AC" },
    period: "/mois",
    description:
      "Pour les cr\u00E9ateurs qui veulent un vrai cockpit business au quotidien.",
    features: [
      { text: "Gestion des marques", included: true },
      { text: "Gestion des collaborations", included: true },
      { text: "Calendrier", included: true },
      { text: "Export PDF & CSV", included: true },
      { text: "200 messages IA / jour", included: true },
      { text: "Statistiques avanc\u00E9es", included: true },
      { text: "Assistant IA avanc\u00E9", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Nouveaut\u00E9s en avant-premi\u00E8re", included: true },
    ],
    cta: "Passer \u00E0 Pro",
    href: "/pricing",
    popular: true,
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
          title="Des plans pens\u00E9s pour les cr\u00E9ateurs"
          description="Commencez gratuitement, passez au Pro quand vous \u00EAtes pr\u00EAt."
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

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto items-start">
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
                  : "border-border-subtle bg-bg-surface"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-bg-primary">
                  Le plus choisi
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
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
                </div>
                <AnimatePresence>
                  {plan.popular && billing === "yearly" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-text-muted mt-1"
                    >
                      Factur&eacute; 79.90&euro;/an
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
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
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

              {plan.popular ? (
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
