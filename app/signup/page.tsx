"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const benefits = [
    "14 jours d'essai gratuit",
    "Aucune carte bancaire requise",
    "Accès immédiat au dashboard",
  ];

  async function handleGoogleSignUp() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Pour l'instant, on sign in directement avec les credentials
    // Plus tard : créer le user en base puis sign in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.error) {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-primary px-6">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-radial-top" />
      <div className="pointer-events-none absolute inset-0 bg-orb-left" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-accent" />
            BrandSync
          </Link>
          <p className="mt-3 text-sm text-text-secondary">
            Créez votre espace créateur en quelques secondes
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 space-y-6">
          {/* Benefits */}
          <div className="flex flex-col gap-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-text-secondary">{b}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border-subtle" />

          {/* Google button */}
          <button
            onClick={handleGoogleSignUp}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-medium bg-bg-primary px-4 py-3 text-sm font-medium text-text-primary transition-all hover:border-border-medium hover:bg-bg-elevated cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            S&apos;inscrire avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border-subtle" />
            <span className="text-xs text-text-muted">ou</span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-text-primary">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Emma Laurent"
                  required
                  className="w-full rounded-xl border border-border-subtle bg-bg-primary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-text-primary">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full rounded-xl border border-border-subtle bg-bg-primary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-text-primary">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-border-subtle bg-bg-primary py-3 pl-10 pr-11 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-glow shadow-lg shadow-accent-glow/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : "Créer mon compte"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-text-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-accent hover:text-accent-glow transition-colors font-medium">
            Se connecter
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-text-muted/60">
          En créant un compte, vous acceptez nos{" "}
          <a href="#" className="underline hover:text-text-muted">conditions d&apos;utilisation</a>{" "}
          et notre{" "}
          <a href="#" className="underline hover:text-text-muted">politique de confidentialité</a>.
        </p>
      </motion.div>
    </div>
  );
}
