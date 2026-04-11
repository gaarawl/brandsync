import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <nav className="border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold text-text-primary">BrandSync</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Politique de confidentialit&eacute;</h1>
          <p className="text-sm text-text-muted">Derni&egrave;re mise &agrave; jour : avril 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Donn&eacute;es collect&eacute;es</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Lorsque vous utilisez BrandSync, nous collectons les donn&eacute;es suivantes :
          </p>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 pl-2">
            <li>Nom et adresse email (via Google OAuth)</li>
            <li>Photo de profil Google</li>
            <li>Donn&eacute;es que vous saisissez (marques, collaborations, paiements, &eacute;v&eacute;nements)</li>
            <li>Messages envoy&eacute;s &agrave; l&apos;assistant IA</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Utilisation des donn&eacute;es</h2>
          <p className="text-sm text-text-secondary leading-relaxed">Vos donn&eacute;es sont utilis&eacute;es pour :</p>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 pl-2">
            <li>Fournir et am&eacute;liorer le service BrandSync</li>
            <li>Personnaliser les r&eacute;ponses de l&apos;assistant IA</li>
            <li>G&eacute;rer votre abonnement et votre facturation via Stripe</li>
            <li>Vous envoyer des notifications li&eacute;es &agrave; votre compte</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Stockage et s&eacute;curit&eacute;</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Vos donn&eacute;es sont stock&eacute;es dans une base de donn&eacute;es PostgreSQL h&eacute;berg&eacute;e par Supabase (serveurs EU). Les connexions sont chiffr&eacute;es via SSL. Les paiements sont trait&eacute;s par Stripe &mdash; nous ne stockons jamais vos informations bancaires.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Services tiers</h2>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 pl-2">
            <li><strong>Google OAuth</strong> &mdash; authentification</li>
            <li><strong>Stripe</strong> &mdash; gestion des paiements</li>
            <li><strong>Anthropic (Claude)</strong> &mdash; assistant IA</li>
            <li><strong>Vercel</strong> &mdash; h&eacute;bergement</li>
            <li><strong>Supabase</strong> &mdash; base de donn&eacute;es</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Vos droits</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Conform&eacute;ment au RGPD, vous disposez d&apos;un droit d&apos;acc&egrave;s, de rectification, de suppression et de portabilit&eacute; de vos donn&eacute;es. Vous pouvez supprimer votre compte et toutes vos donn&eacute;es &agrave; tout moment depuis la page Param&egrave;tres. Pour toute demande, contactez-nous &agrave; contact@brandsync.fr.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Cookies</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            BrandSync utilise uniquement des cookies essentiels au fonctionnement du service (session d&apos;authentification). Nous n&apos;utilisons pas de cookies de tracking ni de publicit&eacute;.
          </p>
        </section>
      </div>
    </main>
  );
}
