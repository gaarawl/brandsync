import Link from "next/link";
import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalit\u00E9s", href: "/#features" },
      { label: "Tarifs", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Se connecter", href: "/login" },
      { label: "Cr\u00E9er un compte", href: "/signup" },
    ],
  },
  {
    title: "L\u00E9gal",
    links: [
      { label: "Mentions l\u00E9gales", href: "/legal" },
      { label: "Confidentialit\u00E9", href: "/privacy" },
      { label: "CGU", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="border-t border-border-subtle bg-bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-accent" />
              BrandSync
            </Link>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">
              Le back-office premium des cr&eacute;ateurs modernes.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; 2026 BrandSync. Tous droits r&eacute;serv&eacute;s.
          </p>
          <div className="flex gap-4">
            <Link href="/legal" className="text-xs text-text-muted transition-colors hover:text-text-primary">
              Mentions l&eacute;gales
            </Link>
            <Link href="/privacy" className="text-xs text-text-muted transition-colors hover:text-text-primary">
              Confidentialit&eacute;
            </Link>
            <Link href="/terms" className="text-xs text-text-muted transition-colors hover:text-text-primary">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
