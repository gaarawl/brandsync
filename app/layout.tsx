import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

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
    <html lang="fr" className="antialiased" suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
