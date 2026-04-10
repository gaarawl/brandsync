"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, CreditCard } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Profil",
    description: "Modifiez votre nom, email et photo de profil.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Gérez vos préférences de notifications et alertes.",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Mot de passe, authentification à deux facteurs.",
  },
  {
    icon: CreditCard,
    title: "Abonnement",
    description: "Gérez votre plan et vos informations de paiement.",
  },
  {
    icon: Palette,
    title: "Apparence",
    description: "Personnalisez l'interface selon vos préférences.",
  },
];

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Paramètres</h1>
        <p className="text-sm text-text-muted mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5 hover:border-border-medium transition-colors cursor-pointer space-y-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <s.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">{s.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
