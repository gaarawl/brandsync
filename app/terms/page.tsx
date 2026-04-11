import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Conditions g&eacute;n&eacute;rales d&apos;utilisation</h1>
          <p className="text-sm text-text-muted">Derni&egrave;re mise &agrave; jour : avril 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">1. Objet</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Les pr&eacute;sentes conditions g&eacute;n&eacute;rales d&apos;utilisation (CGU) r&eacute;gissent l&apos;acc&egrave;s et l&apos;utilisation de la plateforme BrandSync, un outil de gestion de collaborations pour cr&eacute;ateurs de contenu.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">2. Inscription</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            L&apos;inscription se fait via un compte Google. En vous inscrivant, vous d&eacute;clarez avoir au moins 16 ans et fournir des informations exactes. Vous &ecirc;tes responsable de la s&eacute;curit&eacute; de votre compte.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">3. Services</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            BrandSync propose un plan gratuit avec des fonctionnalit&eacute;s limit&eacute;es et un plan Pro avec des fonctionnalit&eacute;s avanc&eacute;es. Les d&eacute;tails de chaque plan sont disponibles sur la page <Link href="/pricing" className="text-accent hover:underline">Tarifs</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">4. Abonnement et paiement</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Les abonnements Pro sont factur&eacute;s mensuellement ou annuellement via Stripe. L&apos;abonnement se renouvelle automatiquement. Vous pouvez annuler &agrave; tout moment depuis vos param&egrave;tres &mdash; l&apos;acc&egrave;s Pro reste actif jusqu&apos;&agrave; la fin de la p&eacute;riode pay&eacute;e.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">5. Assistant IA</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            L&apos;assistant IA est fourni &agrave; titre d&apos;aide. Les r&eacute;ponses g&eacute;n&eacute;r&eacute;es peuvent contenir des inexactitudes. BrandSync ne peut &ecirc;tre tenu responsable des d&eacute;cisions prises sur la base des conseils de l&apos;IA. Les messages envoy&eacute;s &agrave; l&apos;IA sont trait&eacute;s par Anthropic et ne sont pas utilis&eacute;s pour entra&icirc;ner leurs mod&egrave;les.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">6. Vos donn&eacute;es</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Vous restez propri&eacute;taire de toutes les donn&eacute;es que vous saisissez dans BrandSync. Vous pouvez exporter vos donn&eacute;es &agrave; tout moment (CSV, PDF) et supprimer votre compte depuis les param&egrave;tres, ce qui entra&icirc;ne la suppression d&eacute;finitive de toutes vos donn&eacute;es.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">7. Limitation de responsabilit&eacute;</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            BrandSync est fourni &laquo; tel quel &raquo;. Nous ne garantissons pas un acc&egrave;s ininterrompu au service. En aucun cas BrandSync ne pourra &ecirc;tre tenu responsable de pertes de donn&eacute;es, de revenus ou de tout dommage indirect li&eacute; &agrave; l&apos;utilisation du service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">8. Modification des CGU</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            BrandSync se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU &agrave; tout moment. Les utilisateurs seront inform&eacute;s de tout changement significatif. La poursuite de l&apos;utilisation du service apr&egrave;s modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">9. Contact</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Pour toute question relative aux pr&eacute;sentes CGU, contactez-nous &agrave; contact@brandsync.fr.
          </p>
        </section>
      </div>
    </main>
  );
}
