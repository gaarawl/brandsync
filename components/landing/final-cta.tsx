"use client";

import { ArrowRight, Play, CircleCheck } from "lucide-react";
import PremiumButton from "@/components/ui/premium-button";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border-subtle">
      <div className="pointer-events-none absolute inset-0 bg-radial-center" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl leading-[1.15]">
            Professionnalisez votre activité créateur dès aujourd&apos;hui
          </h2>
          <p className="text-base text-text-secondary sm:text-lg max-w-xl mx-auto leading-relaxed">
            Moins de chaos. Plus de clarté. Plus de temps pour créer.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <PremiumButton
              variant="primary"
              href="/signup"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Essayer gratuitement
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              href="/login"
              icon={<Play className="h-4 w-4" />}
            >
              Se connecter
            </PremiumButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-accent" />
              Aucune carte requise
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-accent" />
              Mise en route en quelques minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
