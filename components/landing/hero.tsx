"use client";

import { ArrowRight, Play, CircleCheck, Search, Bell, Plus, Home, Users, Building2, CalendarDays, CreditCard, BarChart3 } from "lucide-react";
import PremiumButton from "@/components/ui/premium-button";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

/* ── Mini dashboard data ── */
const sidebarItems = [
  { icon: Home, label: "Accueil", active: true },
  { icon: Users, label: "Collaborations", active: false },
  { icon: Building2, label: "Marques", active: false },
  { icon: CalendarDays, label: "Calendrier", active: false },
  { icon: CreditCard, label: "Paiements", active: false },
  { icon: BarChart3, label: "Statistiques", active: false },
];

const collabs = [
  { brand: "UGC Factory", platform: "TikTok · 3 vidéos", status: "En production", statusColor: "bg-green-500/20 text-green-400", date: "15 mai" },
  { brand: "Summer Campaign", platform: "Instagram · 2 reels", status: "Brief reçu", statusColor: "bg-accent/20 text-accent", date: "18 mai" },
  { brand: "Glow Beauty", platform: "TikTok · 1 vidéo + 1 story", status: "En attente validation", statusColor: "bg-yellow-500/20 text-yellow-400", date: "22 mai" },
  { brand: "TechNova", platform: "YouTube · 1 vidéo", status: "Négociation", statusColor: "bg-orange-500/20 text-orange-400", date: "—" },
];

const calendarEvents = [
  { day: "15", month: "MAI", label: "Rendu UGC Factory", sub: "Livrer 3 vidéos TikTok" },
  { day: "18", month: "MAI", label: "Appel découverte", sub: "Summer Campaign" },
  { day: "22", month: "MAI", label: "Publication", sub: "Glow Beauty" },
];

const payments = [
  { brand: "UGC Factory", amount: "+1 200 €", status: "Payé", statusColor: "text-green-400" },
  { brand: "Glow Beauty", amount: "+950 €", status: "En attente", statusColor: "text-yellow-400" },
  { brand: "TechNova", amount: "+2 800 €", status: "En attente", statusColor: "text-yellow-400" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-radial-top" />
      <div className="pointer-events-none absolute inset-0 bg-orb-left" />
      <div className="pointer-events-none absolute inset-0 bg-orb-right" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* ── Text content ── */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border-medium bg-bg-surface px-4 py-1.5 text-sm text-text-secondary">
              Conçu pour les créateurs. Pensé pour le business.
              <span className="h-2 w-2 rounded-full bg-accent animate-glow-pulse" />
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl leading-[1.08]"
          >
            Le back-office des{" "}
            <span className="text-gradient">créateurs modernes</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-base text-text-secondary sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Gérez vos collaborations, vos contenus, vos paiements et vos
            marques dans un seul espace. Moins d&apos;administratif, plus
            d&apos;impact.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <PremiumButton variant="primary" href="/signup" icon={<ArrowRight className="h-4 w-4" />}>
              Essayer gratuitement
            </PremiumButton>
            <PremiumButton variant="secondary" href="/login" icon={<Play className="h-4 w-4" />}>
              Se connecter
            </PremiumButton>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted"
          >
            {["Aucune carte requise", "Plan gratuit inclus", "Annulation à tout moment"].map(
              (text) => (
                <span key={text} className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-accent" />
                  {text}
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* ── Dashboard mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="mx-auto mt-20 max-w-6xl"
        >
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-1 glow-accent-strong">
            <div className="rounded-[1.25rem] bg-bg-primary overflow-hidden">
              <div className="flex min-h-[480px] lg:min-h-[560px]">
                {/* Sidebar */}
                <aside className="hidden w-56 shrink-0 border-r border-border-subtle bg-bg-surface p-4 lg:flex lg:flex-col">
                  <div className="flex items-center gap-2 text-sm font-bold mb-6">
                    <span className="text-accent">✦</span> BrandSync
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-xs text-text-muted mb-4">
                    <Search className="h-3.5 w-3.5" />
                    Rechercher...
                    <span className="ml-auto text-[10px] border border-border-subtle rounded px-1">⌘K</span>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                          item.active
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    ))}
                  </nav>
                  <div className="mt-auto pt-4 border-t border-border-subtle">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Raccourcis</p>
                    <div className="flex flex-col gap-1">
                      {["UGC Factory", "Summer Campaign", "Studio Vlog"].map((s) => (
                        <span key={s} className="text-xs text-text-secondary px-3 py-1.5">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border-subtle">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-glow" />
                    <div>
                      <p className="text-xs font-medium text-text-primary">Emma L.</p>
                      <p className="text-[10px] text-text-muted">Voir le profil</p>
                    </div>
                  </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-5 lg:p-6 overflow-hidden">
                  {/* Topbar */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">
                        Bonjour Emma <span>👋</span>
                      </h2>
                      <p className="text-xs text-text-muted mt-0.5">
                        Voici un résumé de ton activité aujourd&apos;hui.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-muted sm:flex">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-xs font-medium text-accent">
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Nouvelle collaboration</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
                    {[
                      { label: "REVENUS (MOIS)", value: "12 540 €", sub: "+24% vs mois dernier", subColor: "text-green-400" },
                      { label: "COLLABS EN COURS", value: "7", sub: "+2 cette semaine", subColor: "text-green-400" },
                      { label: "PAIEMENTS EN ATTENTE", value: "3 950 €", sub: "2 factures à relancer", subColor: "text-yellow-400" },
                      { label: "CONTENUS À RENDRE", value: "4", sub: "Prochain : 15 mai", subColor: "text-text-muted" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border-subtle bg-bg-surface p-4"
                      >
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-xl font-bold text-text-primary">
                          {stat.value}
                        </p>
                        <p className={`mt-0.5 text-[11px] ${stat.subColor}`}>
                          {stat.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Content grid */}
                  <div className="grid gap-4 lg:grid-cols-5">
                    {/* Collabs list */}
                    <div className="lg:col-span-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Collaborations en cours
                        </h3>
                        <span className="text-xs text-text-muted">Voir tout</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {collabs.map((c) => (
                          <div
                            key={c.brand}
                            className="flex items-center justify-between rounded-lg bg-bg-primary px-3 py-2.5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-bg-elevated to-bg-surface border border-border-subtle" />
                              <div>
                                <p className="text-xs font-medium text-text-primary">
                                  {c.brand}
                                </p>
                                <p className="text-[10px] text-text-muted">
                                  {c.platform}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${c.statusColor}`}
                              >
                                {c.status}
                              </span>
                              <span className="hidden text-[11px] text-text-muted sm:block">
                                {c.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right panel */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                      {/* Calendar */}
                      <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-text-primary">
                            Calendrier
                          </h3>
                          <span className="text-xs text-text-muted">Voir le calendrier</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {calendarEvents.map((evt) => (
                            <div
                              key={evt.label}
                              className="flex items-start gap-3 rounded-lg bg-bg-primary px-3 py-2.5"
                            >
                              <div className="flex flex-col items-center min-w-[32px]">
                                <span className="text-sm font-bold text-accent leading-none">
                                  {evt.day}
                                </span>
                                <span className="text-[9px] text-text-muted uppercase">
                                  {evt.month}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-text-primary">
                                  {evt.label}
                                </p>
                                <p className="text-[10px] text-text-muted">
                                  {evt.sub}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payments */}
                      <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-text-primary">
                            Paiements récents
                          </h3>
                          <span className="text-xs text-text-muted">Voir tout</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {payments.map((p) => (
                            <div
                              key={p.brand}
                              className="flex items-center justify-between rounded-lg bg-bg-primary px-3 py-2.5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-bg-elevated to-bg-surface border border-border-subtle" />
                                <span className="text-xs text-text-primary">{p.brand}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-medium text-text-primary">
                                  {p.amount}
                                </span>
                                <span className={`text-[10px] font-medium ${p.statusColor}`}>
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Une vue claire sur vos deals, vos deadlines, vos paiements et votre croissance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
