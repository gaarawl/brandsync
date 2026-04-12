import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  MapPin,
  Globe,
  Mail,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Sparkles,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type Rate = { label: string; price: string };

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
    },
  });

  if (!user || !user.mediaKitPublic) {
    notFound();
  }

  const totalRevenue = user.collaborations.reduce((s, c) => s + c.amount, 0);
  const platforms = [...new Set(user.collaborations.map((c) => c.platform))];
  const rates: Rate[] = user.rates ? JSON.parse(user.rates) : [];

  const socials = [
    { icon: Instagram, value: user.instagram, href: `https://instagram.com/${user.instagram?.replace("@", "")}` },
    { icon: () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>, value: user.tiktok, href: `https://tiktok.com/@${user.tiktok?.replace("@", "")}` },
    { icon: Youtube, value: user.youtube, href: `https://youtube.com/@${user.youtube?.replace("@", "")}` },
    { icon: Twitter, value: user.twitter, href: `https://x.com/${user.twitter?.replace("@", "")}` },
    { icon: Linkedin, value: user.linkedin, href: user.linkedin?.startsWith("http") ? user.linkedin : `https://linkedin.com/in/${user.linkedin}` },
  ].filter((s) => s.value);

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent/8 to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Profile header */}
        <div className="text-center mb-10">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="h-24 w-24 rounded-full mx-auto mb-5 ring-4 ring-accent/20 shadow-xl shadow-accent/10"
            />
          ) : (
            <div className="h-24 w-24 rounded-full mx-auto mb-5 bg-gradient-to-br from-accent to-accent-glow ring-4 ring-accent/20 flex items-center justify-center text-2xl font-bold text-white">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {user.name}
          </h1>
          {user.location && (
            <p className="flex items-center justify-center gap-1.5 text-sm text-text-muted mt-2">
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </p>
          )}
          {user.bio && (
            <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Social links */}
          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-5">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Users,
              label: "Collaborations",
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
              className="card-premium rounded-xl p-5 text-center"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="card-premium rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              Plateformes
            </h2>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-accent/10 text-accent px-3 py-1.5 text-xs font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rates */}
        {rates.length > 0 && (
          <div className="card-premium rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4">
              Tarifs
            </h2>
            <div className="space-y-3">
              {rates.map((rate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-bg-primary/60 px-4 py-3 border border-border-subtle"
                >
                  <span className="text-sm text-text-secondary">
                    {rate.label}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {rate.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        {user.email && (
          <a
            href={`mailto:${user.email}`}
            className="group relative flex items-center justify-center gap-2 w-full overflow-hidden rounded-xl py-4 text-sm font-semibold bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.2)]"
          >
            <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
            <span className="absolute -inset-2 rounded-2xl bg-accent/25 blur-xl opacity-70 group-hover:opacity-100 group-hover:bg-accent/35 transition-all duration-500" />
            <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <Mail className="h-4 w-4 relative z-10" />
            <span className="relative z-10">Me contacter</span>
          </a>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
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
