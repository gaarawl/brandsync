"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "À qui s'adresse BrandSync ?",
    a: "BrandSync s'adresse aux créateurs, influenceurs, profils UGC et petits studios qui veulent mieux gérer leurs collaborations, leurs marques, leurs deadlines et leurs paiements.",
  },
  {
    q: "Puis-je l'utiliser seul ?",
    a: "Oui. La plateforme a été pensée pour être utile dès les premiers deals, même sans équipe ou sans assistant.",
  },
  {
    q: "Est-ce que je peux gérer plusieurs plateformes ?",
    a: "Oui. Vous pouvez suivre vos collaborations TikTok, Instagram, YouTube ou d'autres formats dans un seul espace.",
  },
  {
    q: "L'assistant IA sert à quoi ?",
    a: "Il vous aide à répondre à une marque, résumer un brief, reformuler un message, préparer une relance ou structurer une collaboration plus rapidement.",
  },
  {
    q: "Puis-je suivre mes paiements ?",
    a: "Oui. Vous pouvez voir vos paiements attendus, vos factures envoyées, vos montants reçus et l'état de vos collaborations.",
  },
  {
    q: "Y a-t-il une version gratuite ?",
    a: "Oui. Une version gratuite permet de découvrir l'interface et de structurer vos premières collaborations.",
  },
  {
    q: "Est-ce compliqué à utiliser ?",
    a: "Non. L'expérience a été pensée pour être claire, rapide à prendre en main et sans surcharge inutile.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-medium text-text-primary sm:text-base">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-text-secondary">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading title="Questions fréquentes" />

        <div className="mt-12">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
