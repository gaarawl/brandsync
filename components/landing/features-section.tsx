"use client";

import SectionBadge from "@/components/ui/section-badge";
import { motion } from "framer-motion";
import {
  CircleDot,
  ArrowRight,
  Building2,
  Phone,
  DollarSign,
  FileText,
  CalendarDays,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  MessageSquare,
  RefreshCw,
  PenLine,
  TrendingUp,
  Receipt,
  PiggyBank,
  BarChart3,
} from "lucide-react";

/* ── Feature block data ── */
interface Feature {
  badge: string;
  title: string;
  text: string;
  microcopy?: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}

/* ── Mini mockup components ── */

function PipelineMockup() {
  const stages = [
    { label: "Nouveaux leads", count: 3, color: "bg-blue-500/20 text-blue-400" },
    { label: "Négociation", count: 2, color: "bg-orange-500/20 text-orange-400" },
    { label: "En production", count: 4, color: "bg-green-500/20 text-green-400" },
    { label: "Facture envoyée", count: 2, color: "bg-accent/20 text-accent" },
    { label: "Paiement reçu", count: 5, color: "bg-emerald-500/20 text-emerald-400" },
  ];

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <CircleDot className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">Pipeline</span>
      </div>
      {stages.map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-xl bg-bg-primary px-4 py-3 border border-border-subtle">
          <div className="flex items-center gap-3">
            <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-primary">{s.label}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${s.color}`}>{s.count} deals</span>
        </div>
      ))}
    </div>
  );
}

function CrmMockup() {
  const brands = [
    { name: "UGC Factory", campaigns: 5, budget: "12 000 €", status: "Actif" },
    { name: "Glow Beauty", campaigns: 3, budget: "6 500 €", status: "Actif" },
    { name: "TechNova", campaigns: 1, budget: "2 800 €", status: "En cours" },
  ];
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">CRM Marques</span>
      </div>
      <div className="grid grid-cols-4 gap-2 px-3 py-2 text-[10px] text-text-muted uppercase tracking-wider">
        <span>Marque</span><span>Campagnes</span><span>Budget total</span><span>Statut</span>
      </div>
      {brands.map((b) => (
        <div key={b.name} className="grid grid-cols-4 gap-2 items-center rounded-xl bg-bg-primary px-3 py-3 border border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent/30 to-accent-glow/20" />
            <span className="text-xs font-medium text-text-primary truncate">{b.name}</span>
          </div>
          <span className="text-xs text-text-secondary">{b.campaigns}</span>
          <span className="text-xs text-text-secondary">{b.budget}</span>
          <span className="text-[10px] text-green-400">{b.status}</span>
        </div>
      ))}
      <p className="text-[11px] text-text-muted pt-1 text-center">
        Chaque marque a sa fiche. Chaque deal a son contexte.
      </p>
    </div>
  );
}

function CalendarMockup() {
  const events = [
    { day: "12", label: "Rendu TikTok", type: "Livrable", icon: Send, color: "border-l-green-500" },
    { day: "14", label: "Validation Glow Beauty", type: "Validation", icon: CheckCircle2, color: "border-l-accent" },
    { day: "15", label: "Facture UGC Factory", type: "Facture", icon: Receipt, color: "border-l-yellow-500" },
    { day: "18", label: "Appel Summer Campaign", type: "Appel", icon: Phone, color: "border-l-blue-500" },
    { day: "20", label: "Publication Instagram", type: "Publication", icon: Clock, color: "border-l-pink-500" },
  ];
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">Mai 2026</span>
      </div>
      {events.map((evt) => (
        <div key={evt.label} className={`flex items-center gap-3 rounded-xl bg-bg-primary px-4 py-3 border border-border-subtle border-l-2 ${evt.color}`}>
          <span className="text-sm font-bold text-accent min-w-[20px]">{evt.day}</span>
          <div className="flex-1">
            <p className="text-xs font-medium text-text-primary">{evt.label}</p>
            <p className="text-[10px] text-text-muted">{evt.type}</p>
          </div>
          <evt.icon className="h-4 w-4 text-text-muted" />
        </div>
      ))}
      <p className="text-[11px] text-text-muted pt-1 text-center">
        Moins d&apos;oubli. Plus de maîtrise.
      </p>
    </div>
  );
}

function AiMockup() {
  const suggestions = [
    { label: "Répondre à cette marque", icon: MessageSquare },
    { label: "Résumer ce brief", icon: FileText },
    { label: "Préparer une relance", icon: RefreshCw },
    { label: "Reformuler plus pro", icon: PenLine },
    { label: "Faire une contre-proposition", icon: DollarSign },
  ];
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">Assistant IA</span>
      </div>
      <div className="rounded-xl bg-bg-primary border border-border-subtle p-4 space-y-2">
        <p className="text-xs text-text-muted mb-3">Que souhaitez-vous faire ?</p>
        {suggestions.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg bg-bg-surface px-3 py-2.5 border border-border-subtle hover:border-accent/30 transition-colors cursor-pointer">
            <s.icon className="h-4 w-4 text-accent" />
            <span className="text-xs text-text-primary">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-accent/5 border border-accent/15 p-3">
        <p className="text-[11px] text-accent leading-relaxed">
          &quot;Bonjour, merci pour votre brief détaillé. Je serais ravie de collaborer sur cette campagne. Voici mes disponibilités pour la semaine prochaine...&quot;
        </p>
        <p className="text-[10px] text-text-muted mt-2">Généré par l&apos;IA · Modifier avant envoi</p>
      </div>
    </div>
  );
}

function RevenueMockup() {
  const months = [
    { label: "Jan", h: 30 }, { label: "Fév", h: 45 }, { label: "Mar", h: 38 },
    { label: "Avr", h: 55 }, { label: "Mai", h: 72 }, { label: "Jun", h: 65 },
  ];
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-text-primary">Revenus</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-bg-primary border border-border-subtle p-3 text-center">
          <PiggyBank className="h-4 w-4 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-text-primary">42 300 €</p>
          <p className="text-[10px] text-text-muted">Total 2026</p>
        </div>
        <div className="rounded-xl bg-bg-primary border border-border-subtle p-3 text-center">
          <Receipt className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-text-primary">3 950 €</p>
          <p className="text-[10px] text-text-muted">En attente</p>
        </div>
        <div className="rounded-xl bg-bg-primary border border-border-subtle p-3 text-center">
          <BarChart3 className="h-4 w-4 text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-text-primary">+24%</p>
          <p className="text-[10px] text-text-muted">Ce mois</p>
        </div>
      </div>
      {/* Mini chart */}
      <div className="rounded-xl bg-bg-primary border border-border-subtle p-4">
        <div className="flex items-end justify-between gap-2 h-24">
          {months.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-accent/40 to-accent/80 transition-all"
                style={{ height: `${m.h}%` }}
              />
              <span className="text-[9px] text-text-muted">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted text-center">
        Parce qu&apos;être créateur, c&apos;est aussi gérer une activité.
      </p>
    </div>
  );
}

/* ── Features data ── */
const features: Feature[] = [
  {
    badge: "Pipeline",
    title: "Suivez chaque collaboration du premier message jusqu'au paiement",
    text: "Transformez chaque opportunité en deal structuré. Visualisez en un coup d'œil ce qui doit être répondu, négocié, produit, validé ou relancé.",
    mockup: <PipelineMockup />,
  },
  {
    badge: "CRM Marques",
    title: "Gardez un historique clair de chaque marque",
    text: "Retrouvez les bons contacts, les campagnes passées, les budgets, les délais de paiement et vos notes privées sur chaque marque.",
    mockup: <CrmMockup />,
    reverse: true,
  },
  {
    badge: "Calendrier",
    title: "Ne ratez plus aucune deadline",
    text: "Rendus UGC, publications, validations, appels, factures à envoyer, paiements attendus : tout apparaît dans un calendrier pensé pour les créateurs qui gèrent plusieurs collabs à la fois.",
    mockup: <CalendarMockup />,
  },
  {
    badge: "Assistant IA",
    title: "Répondez plus vite, plus clairement, plus pro",
    text: "Utilisez l'IA pour rédiger une réponse à une marque, résumer un brief, préparer une contre-offre, reformuler un message ou relancer un paiement en quelques secondes.",
    mockup: <AiMockup />,
    reverse: true,
  },
  {
    badge: "Revenus",
    title: "Pilotez votre activité comme un vrai business",
    text: "Suivez vos revenus du mois, vos paiements en attente, vos factures envoyées et les marques qui vous rapportent le plus.",
    mockup: <RevenueMockup />,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 space-y-28">
        {features.map((feat, i) => (
          <motion.div
            key={feat.badge}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col gap-12 items-center lg:gap-16 ${
              feat.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            {/* Text */}
            <div className="flex-1 space-y-5 max-w-xl">
              <SectionBadge>{feat.badge}</SectionBadge>
              <h3 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl leading-[1.15]">
                {feat.title}
              </h3>
              <p className="text-base text-text-secondary leading-relaxed">
                {feat.text}
              </p>
              {feat.microcopy && (
                <p className="text-sm text-text-muted italic">{feat.microcopy}</p>
              )}
            </div>

            {/* Mockup */}
            <div className="flex-1 w-full max-w-lg">{feat.mockup}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
