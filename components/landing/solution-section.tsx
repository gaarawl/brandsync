"use client";

import { Layers, Zap, TrendingUp, CalendarCheck } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import SectionHeading from "@/components/ui/section-heading";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: Layers,
    title: "Centralisez tout",
    text: "Briefs, contrats, messages, deadlines, contenus et paiements : tout est enfin réuni.",
  },
  {
    icon: Zap,
    title: "Gagnez du temps",
    text: "L'assistant IA vous aide à répondre, résumer, relancer et structurer vos échanges.",
  },
  {
    icon: TrendingUp,
    title: "Suivez vos revenus",
    text: "Visualisez vos factures, vos paiements en attente et la croissance de votre activité.",
  },
  {
    icon: CalendarCheck,
    title: "Restez organisé",
    text: "Chaque collaboration avance avec un statut clair, un calendrier propre et des priorités visibles.",
  },
];

export default function SolutionSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Un seul espace pour piloter toute votre activité créateur"
          description="De la première prise de contact jusqu'au paiement final, BrandSync centralise vos collaborations, vos marques, vos livrables, vos documents et votre calendrier dans une interface simple, claire et premium."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full space-y-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {item.text}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
