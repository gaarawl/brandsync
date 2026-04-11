import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function LegalPage() {
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Mentions l&eacute;gales</h1>
          <p className="text-sm text-text-muted">Derni&egrave;re mise &agrave; jour : avril 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">&Eacute;diteur du site</h2>
          <div className="text-sm text-text-secondary leading-relaxed space-y-1">
            <p>BrandSync est un service &eacute;dit&eacute; par Tom (auto-entrepreneur).</p>
            <p>Email de contact : contact@brandsync.fr</p>
            <p>Le site est h&eacute;berg&eacute; par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, &Eacute;tats-Unis.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Propri&eacute;t&eacute; intellectuelle</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            L&apos;ensemble du contenu du site BrandSync (textes, graphismes, logo, ic&ocirc;nes, images, logiciels) est la propri&eacute;t&eacute; exclusive de BrandSync, sauf mention contraire. Toute reproduction, repr&eacute;sentation, modification, publication ou adaptation de tout ou partie du site est interdite sans autorisation pr&eacute;alable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Responsabilit&eacute;</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            BrandSync s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffus&eacute;es sur le site. Toutefois, BrandSync ne peut garantir l&apos;exactitude, la compl&eacute;tude ou l&apos;actualit&eacute; des informations. BrandSync d&eacute;cline toute responsabilit&eacute; pour tout dommage r&eacute;sultant de l&apos;utilisation du site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Donn&eacute;es personnelles</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Consultez notre <Link href="/privacy" className="text-accent hover:underline">politique de confidentialit&eacute;</Link> pour conna&icirc;tre la mani&egrave;re dont nous collectons et traitons vos donn&eacute;es personnelles.
          </p>
        </section>
      </div>
    </main>
  );
}
