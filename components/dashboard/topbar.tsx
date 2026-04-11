"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import NotificationsDropdown from "@/components/dashboard/notifications-dropdown";

type Notification = {
  id: string;
  type: "deadline" | "overdue" | "upcoming";
  title: string;
  description: string;
  date: string;
};

interface TopbarProps {
  userName?: string | null;
  notifications?: Notification[];
}

export default function Topbar({ userName, notifications = [] }: TopbarProps) {
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
        <NotificationsDropdown notifications={notifications} />

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
