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
  Sun,
  Moon,
  Bot,
  Crown,
  FileUser,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const mainNav = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: Users, label: "Collaborations", href: "/dashboard/collaborations" },
  { icon: Building2, label: "Marques", href: "/dashboard/marques" },
  { icon: CalendarDays, label: "Calendrier", href: "/dashboard/calendrier" },
  { icon: CreditCard, label: "Paiements", href: "/dashboard/paiements" },
  { icon: BarChart3, label: "Statistiques", href: "/dashboard/statistiques" },
  { icon: Bot, label: "IA Assistant", href: "/dashboard/ai" },
  { icon: Mail, label: "Emails", href: "/dashboard/emails" },
  { icon: FileUser, label: "Media Kit", href: "/dashboard/media-kit" },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: string;
  };
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors w-full",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? (theme === "dark" ? "Mode clair" : "Mode sombre") : undefined}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] shrink-0" />
      ) : (
        <Moon className="h-[18px] w-[18px] shrink-0" />
      )}
      {!collapsed && (theme === "dark" ? "Mode clair" : "Mode sombre")}
    </button>
  );
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border-subtle sidebar-glass transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-glow shadow-lg shadow-accent/20">
            <Sparkles className="h-4 w-4 text-white shrink-0" />
          </div>
          {!collapsed && <span className="text-sm font-bold tracking-tight">BrandSync</span>}
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
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-accent/10 text-accent font-medium shadow-sm shadow-accent/5 border border-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

      </nav>

      {/* Upgrade / Bottom nav */}
      <div className="border-t border-border-subtle px-3 py-2 space-y-1">
        {user.plan !== "pro" && (
          <Link
            href="/pricing"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-accent/15 via-accent/10 to-purple-600/10 text-accent border border-accent/15 hover:border-accent/30 hover:shadow-md hover:shadow-accent/10 transition-all duration-300",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Passer au Pro" : undefined}
          >
            <Crown className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && "Passer au Pro"}
          </Link>
        )}
        <ThemeToggle collapsed={collapsed} />
        {!collapsed && (
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <Settings className="h-[18px] w-[18px]" />
            Paramètres
          </Link>
        )}
      </div>

      {/* User */}
      <div className="border-t border-border-subtle px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-bg-elevated/50 transition-colors",
            collapsed && "justify-center"
          )}
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-8 w-8 rounded-full shrink-0 ring-2 ring-border-subtle"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-glow shrink-0 ring-2 ring-accent/20" />
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
