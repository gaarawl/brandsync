import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Tarifs", "Sécurité", "Mises à jour"],
  },
  {
    title: "Ressources",
    links: ["Centre d'aide", "Guides", "Blog", "Démo"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Contact", "Partenaires"],
  },
  {
    title: "Légal",
    links: [
      "Mentions légales",
      "Politique de confidentialité",
      "Conditions d'utilisation",
    ],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="border-t border-border-subtle bg-bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-accent" />
              BrandSync
            </a>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">
              Le back-office premium des créateurs modernes.
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
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; 2026 BrandSync. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "Instagram"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
