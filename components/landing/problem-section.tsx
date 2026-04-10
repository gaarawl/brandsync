"use client";

import { FileSearch, Wallet, CalendarClock, BarChart2 } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import SectionHeading from "@/components/ui/section-heading";
import { motion } from "framer-motion";

const problems = [
  {
    icon: FileSearch,
    title: "Des briefs éparpillés",
    text: "Retrouvez enfin vos messages, vos documents et vos consignes au même endroit.",
  },
  {
    icon: Wallet,
    title: "Des paiements oubliés",
    text: "Sachez exactement qui doit vous payer, combien, et depuis quand.",
  },
  {
    icon: CalendarClock,
    title: "Des deadlines qui se croisent",
    text: "Gardez une vision claire sur vos rendus, validations et dates de publication.",
  },
  {
    icon: BarChart2,
    title: "Aucune vraie vue business",
    text: "Pilotez votre activité avec plus qu'un simple fil de DM et quelques notes.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Les collaborations ne devraient pas vivre dans vos DM, vos mails et vos notes"
          description="Aujourd'hui, trop de créateurs gèrent leur activité entre Instagram, Gmail, Drive, rappels perso et tableaux bricolés. Résultat : des opportunités perdues, des délais flous, des briefs introuvables et une charge mentale inutile."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((item, i) => (
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
