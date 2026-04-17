"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Link2,
  Plus,
  Trash2,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { updateMediaKit } from "@/lib/actions/user";
import LinkEditor, { type LinkItem } from "@/components/dashboard/link-editor";

type Rate = { label: string; price: string };

interface MediaKitData {
  slug: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  twitter: string | null;
  linkedin: string | null;
  rates: string | null;
  mediaKitPublic: boolean;
  name: string;
  image: string | null;
  stats: { collabs: number; brands: number; revenue: number };
  links: LinkItem[];
  pageViews: number;
}

export default function MediaKitPage({ data }: { data: MediaKitData }) {
  const [isPending, startTransition] = useTransition();
  const [slug, setSlug] = useState(data.slug || "");
  const [bio, setBio] = useState(data.bio || "");
  const [location, setLocation] = useState(data.location || "");
  const [website, setWebsite] = useState(data.website || "");
  const [instagram, setInstagram] = useState(data.instagram || "");
  const [tiktok, setTiktok] = useState(data.tiktok || "");
  const [youtube, setYoutube] = useState(data.youtube || "");
  const [twitter, setTwitter] = useState(data.twitter || "");
  const [linkedin, setLinkedin] = useState(data.linkedin || "");
  const [isPublic, setIsPublic] = useState(data.mediaKitPublic);
  const [rates, setRates] = useState<Rate[]>(
    data.rates ? JSON.parse(data.rates) : []
  );
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Track what's actually saved in DB to avoid showing links to unsaved kits
  const [savedSlug, setSavedSlug] = useState(data.slug || "");
  const [savedPublic, setSavedPublic] = useState(data.mediaKitPublic);

  const addRate = () => setRates([...rates, { label: "", price: "" }]);
  const removeRate = (i: number) => setRates(rates.filter((_, idx) => idx !== i));
  const updateRate = (i: number, field: keyof Rate, value: string) => {
    const updated = [...rates];
    updated[i][field] = value;
    setRates(updated);
  };

  const handleSave = () => {
    setError("");
    setSaved(false);
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("bio", bio);
    fd.set("location", location);
    fd.set("website", website);
    fd.set("instagram", instagram);
    fd.set("tiktok", tiktok);
    fd.set("youtube", youtube);
    fd.set("twitter", twitter);
    fd.set("linkedin", linkedin);
    fd.set("rates", JSON.stringify(rates.filter((r) => r.label && r.price)));
    fd.set("mediaKitPublic", String(isPublic));

    startTransition(async () => {
      try {
        await updateMediaKit(fd);
        setSavedSlug(slug);
        setSavedPublic(isPublic);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e: any) {
        setError(e.message || "Erreur lors de la sauvegarde");
      }
    });
  };

  const kitUrl = savedSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/kit/${savedSlug}`
    : null;

  const hasUnsavedChanges = slug !== savedSlug || isPublic !== savedPublic;

  const copyLink = () => {
    if (kitUrl) {
      navigator.clipboard.writeText(kitUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-page-marques">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Media Kit
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Ta page link-in-bio à partager partout
            </p>
            {data.pageViews > 0 && (
              <p className="text-xs text-accent mt-1">
                {data.pageViews.toLocaleString("fr-FR")} vue{data.pageViews > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {kitUrl && savedPublic && (
              <>
                <a
                  href={kitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Prévisualiser
                </a>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15 transition-colors"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copié !" : "Copier le lien"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* URL & Visibility */}
        <section className="card-premium rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">
            Lien & visibilité
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">
                Ton lien public
              </label>
              <div className="flex items-center gap-0 rounded-lg border border-border-subtle overflow-hidden">
                <span className="bg-bg-elevated px-3 py-2.5 text-xs text-text-muted border-r border-border-subtle shrink-0">
                  /kit/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="ton-pseudo"
                  className="flex-1 bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPublic(!isPublic)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isPublic ? "bg-accent" : "bg-bg-elevated border border-border-subtle"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isPublic ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-text-secondary">
                Page publique visible
              </span>
            </label>
          </div>
        </section>

        {/* Bio & Location */}
        <section className="card-premium rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">
            À propos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Créateur de contenu spécialisé en lifestyle et tech..."
                className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> Localisation
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Paris, France"
                  className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Globe className="h-3 w-3" /> Site web
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://monsite.com"
                  className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social links */}
        <section className="card-premium rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">
            Réseaux sociaux
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Instagram, label: "Instagram", value: instagram, set: setInstagram, placeholder: "@tonpseudo" },
              { icon: () => <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>, label: "TikTok", value: tiktok, set: setTiktok, placeholder: "@tonpseudo" },
              { icon: Youtube, label: "YouTube", value: youtube, set: setYoutube, placeholder: "@tonpseudo" },
              { icon: Twitter, label: "X / Twitter", value: twitter, set: setTwitter, placeholder: "@tonpseudo" },
            ].map((social) => (
              <div key={social.label}>
                <label className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                  <social.icon className="h-3.5 w-3.5" /> {social.label}
                </label>
                <input
                  type="text"
                  value={social.value}
                  onChange={(e) => social.set(e.target.value)}
                  placeholder={social.placeholder}
                  className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Rates */}
        <section className="card-premium rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Tarifs
            </h2>
            <button
              onClick={addRate}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-glow transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
          {rates.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">
              Aucun tarif. Clique sur "Ajouter" pour en créer.
            </p>
          ) : (
            <div className="space-y-3">
              {rates.map((rate, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={rate.label}
                    onChange={(e) => updateRate(i, "label", e.target.value)}
                    placeholder="Ex: Story Instagram"
                    className="flex-1 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                  />
                  <input
                    type="text"
                    value={rate.price}
                    onChange={(e) => updateRate(i, "price", e.target.value)}
                    placeholder="Ex: 150€"
                    className="w-28 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-colors"
                  />
                  <button
                    onClick={() => removeRate(i)}
                    className="text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Links */}
        <LinkEditor links={data.links} />

        {/* Save */}
        {error && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}
        {hasUnsavedChanges && (
          <p className="text-xs text-amber-400 mb-3">
            ⚠ Modifications non sauvegardées — sauvegarde pour que ton lien fonctionne
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={isPending || !slug}
          className="w-full rounded-xl bg-accent text-white py-3 text-sm font-semibold hover:bg-accent-glow transition-colors disabled:opacity-50 shadow-md shadow-accent/20"
        >
          {isPending ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder le Media Kit"}
        </button>
      </motion.div>
    </main>
  );
}
