"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Home,
  Users,
  Building2,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNav = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: Users, label: "Collaborations", href: "/dashboard/collaborations" },
  { icon: Building2, label: "Marques", href: "/dashboard/marques" },
  { icon: CalendarDays, label: "Calendrier", href: "/dashboard/calendrier" },
  { icon: CreditCard, label: "Paiements", href: "/dashboard/paiements" },
  { icon: BarChart3, label: "Statistiques", href: "/dashboard/statistiques" },
];

const shortcuts = [
  { label: "UGC Factory", color: "bg-red-500" },
  { label: "Summer Campaign", color: "bg-blue-500" },
  { label: "Studio Vlog", color: "bg-green-500" },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border-subtle bg-bg-surface transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent shrink-0" />
          {!collapsed && <span className="text-sm font-bold">BrandSync</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-muted hover:text-text-primary transition-colors hidden lg:block"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-xs text-text-muted">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Rechercher...</span>
            <span className="ml-auto text-[10px] border border-border-subtle rounded px-1">
              ⌘K
            </span>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {/* Shortcuts */}
        {!collapsed && (
          <div className="pt-6">
            <p className="px-3 text-[10px] text-text-muted uppercase tracking-wider mb-2">
              Raccourcis
            </p>
            {shortcuts.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-sm shrink-0", s.color)}
                />
                {s.label}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom nav */}
      {!collapsed && (
        <div className="border-t border-border-subtle px-3 py-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <Settings className="h-[18px] w-[18px]" />
            Paramètres
          </Link>
        </div>
      )}

      {/* User */}
      <div className="border-t border-border-subtle px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2 py-2",
            collapsed && "justify-center"
          )}
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-8 w-8 rounded-full shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-glow shrink-0" />
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {user.name || "Utilisateur"}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
