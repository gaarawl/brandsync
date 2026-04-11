"use client";

import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";

interface TopbarProps {
  userName?: string | null;
}

export default function Topbar({ userName }: TopbarProps) {
  const firstName = userName?.split(" ")[0] || "Créateur";

  return (
    <div className="flex items-center justify-between border-b border-border-subtle bg-bg-primary px-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-text-primary">
          Bonjour {firstName} <span>👋</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Voici un résumé de ton activité aujourd&apos;hui.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <Link
          href="/dashboard/collaborations"
          className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3.5 py-2 text-xs font-medium text-accent hover:bg-accent/15 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nouvelle collaboration</span>
        </Link>

        <SignOutButton />
      </div>
    </div>
  );
}
