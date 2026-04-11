"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  User,
  Shield,
  BarChart3,
  LogOut,
  Check,
  Trash2,
} from "lucide-react";
import { updateProfile, deleteAccount } from "@/lib/actions/user";
import Image from "next/image";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
    providers: string[];
    createdAt: string;
    stats: {
      brands: number;
      collaborations: number;
      payments: number;
    };
  };
};

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent/50";

export default function SettingsClient({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleUpdateProfile = async (formData: FormData) => {
    startTransition(async () => {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleDeleteAccount = () => {
    if (
      !confirm(
        "Supprimer votre compte ? Toutes vos données seront perdues."
      )
    )
      return;
    if (!confirm("Êtes-vous vraiment sûr ? Cette action est irréversible."))
      return;
    startTransition(async () => {
      await deleteAccount();
      signOut({ callbackUrl: "/" });
    });
  };

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Paramètres
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <User className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Profil</h2>
            <p className="text-xs text-text-muted">
              Vos informations personnelles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt="Avatar"
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/40 to-accent-glow/40" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Membre depuis {createdDate}
            </p>
          </div>
        </div>

        <form action={handleUpdateProfile} className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">Nom</label>
            <input
              name="name"
              defaultValue={user.name}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Email</label>
            <input
              value={user.email}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
            <p className="text-[11px] text-text-muted mt-1">
              L&apos;email est lié à votre compte Google.
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent-glow transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : isPending ? (
              "..."
            ) : (
              "Enregistrer"
            )}
          </button>
        </form>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Sécurité
            </h2>
            <p className="text-xs text-text-muted">
              Connexion et sécurité du compte
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-bg-primary px-4 py-3 border border-border-subtle">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div>
                <p className="text-sm text-text-primary">Google</p>
                <p className="text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-medium text-green-400">
              Connecté
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:border-border-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </motion.div>

      {/* Account stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <BarChart3 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Votre compte
            </h2>
            <p className="text-xs text-text-muted">
              Résumé de votre activité
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-bg-primary p-4 text-center border border-border-subtle">
            <p className="text-2xl font-bold text-text-primary">
              {user.stats.brands}
            </p>
            <p className="text-xs text-text-muted mt-1">Marques</p>
          </div>
          <div className="rounded-lg bg-bg-primary p-4 text-center border border-border-subtle">
            <p className="text-2xl font-bold text-text-primary">
              {user.stats.collaborations}
            </p>
            <p className="text-xs text-text-muted mt-1">Collabs</p>
          </div>
          <div className="rounded-lg bg-bg-primary p-4 text-center border border-border-subtle">
            <p className="text-2xl font-bold text-text-primary">
              {user.stats.payments}
            </p>
            <p className="text-xs text-text-muted mt-1">Paiements</p>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-red-500/20 bg-bg-surface p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-red-400">Zone de danger</h2>
        <p className="text-xs text-text-muted">
          La suppression de votre compte est définitive. Toutes vos
          marques, collaborations, paiements et événements seront
          supprimés.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </button>
      </motion.div>
    </main>
  );
}
