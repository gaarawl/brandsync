"use client";

import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import PremiumButton from "@/components/ui/premium-button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "0€",
    description:
      "Pour découvrir la plateforme et structurer vos premières collaborations.",
    features: [
      "Jusqu'à 3 marques",
      "Jusqu'à 5 collaborations",
      "Vue dashboard",
      "Assistant IA limité",
      "Calendrier simplifié",
    ],
    cta: "Commencer gratuitement",
  },
  {
    name: "Pro",
    price: "24€",
    period: "/mois",
    description:
      "Pour les créateurs qui veulent un vrai cockpit business au quotidien.",
    features: [
      "Collaborations illimitées",
      "CRM marques complet",
      "Calendrier avancé",
      "Suivi des paiements",
      "Assistant IA avancé",
      "Analytics business",
    ],
    cta: "Passer à Pro",
    popular: true,
  },
  {
    name: "Studio",
    price: "59€",
    period: "/mois",
    description:
      "Pour les créateurs structurés, assistants ou petits studios qui gèrent plusieurs flux.",
    features: [
      "Multi-utilisateurs",
      "Vue équipe",
      "Plusieurs espaces",
      "Analytics avancées",
      "Gestion centralisée",
      "Support prioritaire",
    ],
    cta: "Choisir Studio",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 border-t border-border-subtle">
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Des plans pensés pour les créateurs qui veulent passer un cap"
          description="Commencez simplement, puis débloquez les outils dont vous avez besoin à mesure que votre activité grandit."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
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
                  <span className="text-4xl font-extrabold text-text-primary">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-text-muted">{plan.period}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-text-secondary">{feat}</span>
                  </li>
                ))}
              </ul>

              <PremiumButton
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full"
              >
                {plan.cta}
              </PremiumButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
