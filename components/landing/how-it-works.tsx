"use client";

import { PlusCircle, FolderOpen, Rocket } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { motion } from "framer-motion";

const steps = [
  {
    icon: PlusCircle,
    number: "01",
    title: "Ajoutez vos collaborations",
    text: "Importez une opportunité, créez une marque, ajoutez un brief ou démarrez un deal en quelques clics.",
  },
  {
    icon: FolderOpen,
    number: "02",
    title: "Organisez votre activité",
    text: "Classez vos campagnes, vos documents, vos deadlines et vos paiements dans un système clair.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Gagnez en clarté et en impact",
    text: "Répondez plus vite, oubliez moins de choses et professionnalisez votre activité au quotidien.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border-subtle">
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Commencez en quelques minutes"
          description="Pas besoin d'une agence ni d'une équipe. BrandSync a été conçu pour les créateurs qui veulent une structure plus propre, sans complexité inutile."
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center space-y-4"
            >
              <span className="text-5xl font-extrabold text-accent/10">
                {step.number}
              </span>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <step.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.text}
              </p>

              {/* Connector line (hidden on mobile & last item) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-border-subtle sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
