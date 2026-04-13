"use client";

import { Plus, Star } from "lucide-react";
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
  userPlan?: string;
  notifications?: Notification[];
}

export default function Topbar({ userName, userPlan, notifications = [] }: TopbarProps) {
  const firstName = userName?.split(" ")[0] || "Créateur";

  return (
    <div className="flex items-center justify-between border-b border-border-subtle bg-bg-primary/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
          <span className="text-text-primary">Bonjour</span>{" "}
          <span className={
            userPlan === "business"
              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              : userPlan === "pro"
              ? "text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              : "text-text-primary"
          }>
            {firstName}
          </span>
          {userPlan === "business" && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
          {userPlan === "pro" && <Star className="h-4 w-4 text-violet-400 fill-violet-400" />}
          <span>👋</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Voici un résumé de ton activité aujourd&apos;hui.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <NotificationsDropdown notifications={notifications} />

        <Link
          href="/dashboard/collaborations"
          className="flex items-center gap-2 rounded-lg bg-accent text-white px-4 py-2 text-xs font-medium hover:bg-accent-glow transition-all duration-200 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nouvelle collaboration</span>
        </Link>

        <SignOutButton />
      </div>
    </div>
  );
}
