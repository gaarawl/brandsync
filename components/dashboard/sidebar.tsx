"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import {
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
  Menu,
  X,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-sm font-bold tracking-tight">BrandSync</span>
        </Link>
        {/* Close button on mobile, collapse on desktop */}
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="h-5 w-5 lg:hidden" />
          <span className="hidden lg:block">
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-xs text-text-muted">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Rechercher...</span>
          <span className="ml-auto text-[10px] border border-border-subtle rounded px-1">
            ⌘K
          </span>
        </div>
      </div>

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
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade / Bottom nav */}
      <div className="border-t border-border-subtle px-3 py-2 space-y-1">
        {user.plan !== "pro" && (
          <Link
            href="/pricing"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-accent/15 via-accent/10 to-purple-600/10 text-accent border border-accent/15 hover:border-accent/30 hover:shadow-md hover:shadow-accent/10 transition-all duration-300"
          >
            <Crown className="h-[18px] w-[18px] shrink-0" />
            Passer au Pro
          </Link>
        )}
        <ThemeToggle collapsed={false} />
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <Settings className="h-[18px] w-[18px]" />
          Paramètres
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-border-subtle px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-bg-elevated/50 transition-colors">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className={cn(
                "h-8 w-8 rounded-full shrink-0 ring-2",
                user.plan === "business"
                  ? "ring-amber-500/50"
                  : user.plan === "pro"
                  ? "ring-violet-500/50"
                  : "ring-border-subtle"
              )}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-glow shrink-0 ring-2 ring-accent/20" />
          )}
          <div className="min-w-0">
            <p className={cn(
              "text-xs font-medium truncate flex items-center gap-1",
              user.plan === "business"
                ? "text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                : user.plan === "pro"
                ? "text-violet-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]"
                : "text-text-primary"
            )}>
              {user.name || "Utilisateur"}
              {user.plan === "business" && (
                <Crown className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
              )}
              {user.plan === "pro" && (
                <Star className="h-3 w-3 text-violet-400 fill-violet-400 shrink-0" />
              )}
            </p>
            <p className="text-[10px] text-text-muted truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button — fixed bottom-right */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl shadow-accent/30 lg:hidden active:scale-95 transition-transform"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-72 flex flex-col sidebar-glass border-r border-border-subtle animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r border-border-subtle sidebar-glass transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Desktop version with collapse support */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <BrandLogo />
            {!collapsed && <span className="text-sm font-bold tracking-tight">BrandSync</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

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
                className={cn(
                  "h-8 w-8 rounded-full shrink-0 ring-2",
                  user.plan === "business"
                    ? "ring-amber-500/50"
                    : user.plan === "pro"
                    ? "ring-violet-500/50"
                    : "ring-border-subtle"
                )}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-glow shrink-0 ring-2 ring-accent/20" />
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className={cn(
                  "text-xs font-medium truncate flex items-center gap-1",
                  user.plan === "business"
                    ? "text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                    : user.plan === "pro"
                    ? "text-violet-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]"
                    : "text-text-primary"
                )}>
                  {user.name || "Utilisateur"}
                  {user.plan === "business" && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                  {user.plan === "pro" && <Star className="h-3 w-3 text-violet-400 fill-violet-400 shrink-0" />}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
