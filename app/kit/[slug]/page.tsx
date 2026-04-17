import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import TrackedLink from "@/components/kit/tracked-link";
import PageViewTracker from "@/components/kit/page-view-tracker";
import ContactButton from "@/components/kit/contact-button";

/** Format a rate price string as "XX,YY€" when it parses as a number. */
function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (!trimmed) return trimmed;
  const cleaned = trimmed.replace(/[€$\s]/g, "");
  let num: number | null = null;
  if (/^\d+(,\d{1,2})?$/.test(cleaned)) {
    num = parseFloat(cleaned.replace(",", "."));
  } else if (/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    num = parseFloat(cleaned);
  }
  if (num === null || isNaN(num)) return trimmed;
  return `${num.toFixed(2).replace(".", ",")}€`;
}

type Rate = { label: string; price: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const user = await prisma.user.findUnique({
    where: { slug },
    select: { name: true, bio: true, mediaKitPublic: true },
  });

  if (!user || !user.mediaKitPublic) {
    return { title: "Page introuvable" };
  }

  return {
    title: `${user.name} — Link in Bio`,
    description: user.bio || `Découvrez le profil de ${user.name} sur BrandSync`,
  };
}

export default async function PublicMediaKit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { collaborations: true, brands: true },
      },
      collaborations: {
        where: { status: "paid" },
        select: { amount: true, platform: true },
      },
      links: {
        where: { active: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!user || !user.mediaKitPublic) {
    notFound();
  }

  const platforms = [...new Set(user.collaborations.map((c) => c.platform))];
  const rates: Rate[] = user.rates ? JSON.parse(user.rates) : [];
  const hasStats = user._count.collaborations > 0 || user._count.brands > 0;

  const socials = [
    { icon: Instagram, value: user.instagram, href: `https://instagram.com/${user.instagram?.replace("@", "")}` },
    { icon: () => <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>, value: user.tiktok, href: `https://tiktok.com/@${user.tiktok?.replace("@", "")}` },
    { icon: Youtube, value: user.youtube, href: `https://youtube.com/@${user.youtube?.replace("@", "")}` },
    { icon: Twitter, value: user.twitter, href: `https://x.com/${user.twitter?.replace("@", "")}` },
  ].filter((s) => s.value);

  return (
    <main className="min-h-screen bg-bg-primary">
      <PageViewTracker userId={user.id} />

      {/* Background gradient */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent pointer-events-none" />

      <div className="relative max-w-md mx-auto px-5 py-12">
        {/* Profile */}
        <div className="text-center mb-8">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="h-24 w-24 rounded-full mx-auto mb-4 ring-4 ring-accent/20 shadow-xl shadow-accent/10 object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-accent to-accent-glow ring-4 ring-accent/20 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-accent/10">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            {user.name}
          </h1>

          {user.location && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-1.5">
              <MapPin className="h-3 w-3" />
              {user.location}
            </p>
          )}

          {user.bio && (
            <p className="text-sm text-text-secondary mt-3 max-w-xs mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Social icons */}
          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-surface border border-border-subtle text-text-muted hover:text-accent hover:border-accent/30 hover:scale-110 transition-all duration-200"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
              {user.website && (
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-surface border border-border-subtle text-text-muted hover:text-accent hover:border-accent/30 hover:scale-110 transition-all duration-200"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Custom links — the main feature */}
        {user.links.length > 0 && (
          <div className="space-y-3 mb-8">
            {user.links.map((link, index) => (
              <TrackedLink
                key={link.id}
                id={link.id}
                title={link.title}
                url={link.url}
                emoji={link.emoji}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {hasStats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                icon: Users,
                label: "Collabs",
                value: user._count.collaborations,
                color: "text-accent bg-accent/10",
              },
              {
                icon: Building2,
                label: "Marques",
                value: user._count.brands,
                color: "text-blue-400 bg-blue-500/10",
              },
              {
                icon: TrendingUp,
                label: "Plateformes",
                value: platforms.length,
                color: "text-green-400 bg-green-500/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-premium rounded-xl p-4 text-center"
              >
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg mb-2 ${stat.color}`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-xl font-bold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="card-premium rounded-xl p-5 mb-5">
            <h2 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Plateformes
            </h2>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rates */}
        {rates.length > 0 && (
          <div className="card-premium rounded-xl p-5 mb-5">
            <h2 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Tarifs
            </h2>
            <div className="space-y-2">
              {rates.map((rate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-bg-primary/60 px-4 py-2.5 border border-border-subtle"
                >
                  <span className="text-sm text-text-secondary">
                    {rate.label}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatPrice(rate.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA — prefers public contactEmail, falls back to account email */}
        {(user.contactEmail || user.email) && (
          <ContactButton
            email={user.contactEmail || user.email!}
            name={user.name || "ce créateur"}
          />
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Créé avec BrandSync
          </Link>
        </div>
      </div>
    </main>
  );
}
