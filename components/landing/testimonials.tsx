"use client";

import SectionHeading from "@/components/ui/section-heading";
import GlassCard from "@/components/ui/glass-card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Avant, j'avais mes briefs dans mes mails, mes validations dans mes DM et mes paiements dans ma tête. Maintenant, tout est enfin au même endroit.",
    name: "Emma L.",
    role: "Créatrice UGC",
  },
  {
    quote:
      "Le plus gros changement, c'est la clarté. Je sais exactement ce que j'ai à rendre, ce qui a été validé et ce qu'il faut relancer.",
    name: "Lina R.",
    role: "Créatrice lifestyle",
  },
  {
    quote:
      "J'ai l'impression de gérer mon activité de manière beaucoup plus pro. C'est simple, clean, et ça enlève un vrai poids mental.",
    name: "Yacine M.",
    role: "Créateur TikTok",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Les créateurs veulent créer. Pas gérer le chaos."
          description="BrandSync a été pensé pour enlever la charge mentale derrière chaque collaboration."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full space-y-5 p-7">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/40 to-accent-glow/30" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
