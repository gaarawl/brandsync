"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
  href?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer text-sm rounded-full";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg-primary px-6 py-3 hover:bg-accent-glow shadow-lg shadow-accent-glow/20 hover:shadow-accent-glow/30",
  secondary:
    "bg-transparent text-text-primary px-6 py-3 border border-border-medium hover:border-accent/40 hover:text-accent",
  ghost:
    "bg-transparent text-text-secondary px-4 py-2 hover:text-text-primary",
};

export default function PremiumButton({
  children,
  variant = "primary",
  className,
  icon,
  href,
}: PremiumButtonProps) {
  const content = (
    <>
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
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
