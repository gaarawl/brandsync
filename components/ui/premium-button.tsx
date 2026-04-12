"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
  href?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer text-sm";

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden rounded-xl bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] text-white px-7 py-3.5 shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.2)]",
  secondary:
    "rounded-xl bg-transparent text-text-primary px-7 py-3.5 border border-border-medium hover:border-accent/40 hover:text-accent",
  ghost:
    "rounded-full bg-transparent text-text-secondary px-4 py-2 hover:text-text-primary",
};

export default function PremiumButton({
  children,
  variant = "primary",
  className,
  icon,
  href,
}: PremiumButtonProps) {
  const isPrimary = variant === "primary";

  const content = (
    <>
      {/* Glow layers for primary variant */}
      {isPrimary && (
        <>
          <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
          <span className="absolute -inset-2 rounded-2xl bg-accent/25 blur-xl opacity-70 group-hover:opacity-100 group-hover:bg-accent/35 transition-all duration-500" />
          <span className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </>
      )}
      <span className={isPrimary ? "relative z-10 flex items-center gap-2" : "flex items-center gap-2"}>
        {children}
        {icon && <span className="ml-0.5">{icon}</span>}
      </span>
    </>
  );

  const classes = cn(base, variants[variant], isPrimary && "group", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
