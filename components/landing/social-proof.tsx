"use client";

import { motion } from "framer-motion";

const logos = ["RHODE", "GYMSHARK", "LANCÔME", "SHEIN", "AIR UP", "NIKE"];

export default function SocialProof() {
  return (
    <section className="relative border-y border-border-subtle py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[0.2em] text-text-muted mb-12"
        >
          Pensé pour les créateurs qui travaillent avec des marques exigeantes
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8"
        >
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-xl font-bold tracking-wider text-text-muted/50 transition-colors hover:text-text-muted sm:text-2xl"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
