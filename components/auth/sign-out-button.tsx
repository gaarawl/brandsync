"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-xl border border-border-medium bg-bg-primary px-5 py-2.5 text-sm text-text-secondary transition-all hover:text-text-primary hover:border-red-500/30 hover:bg-red-500/5 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </button>
  );
}
