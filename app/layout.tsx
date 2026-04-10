import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandSync — Le back-office des créateurs modernes",
  description:
    "Gérez vos collaborations, vos contenus, vos paiements et vos marques dans un seul espace. Moins d'administratif, plus d'impact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="antialiased">
      <body className="bg-bg-primary text-text-primary overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
