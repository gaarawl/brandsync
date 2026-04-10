"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-border-subtle bg-bg-surface p-6",
        hover &&
          "transition-all duration-300 hover:border-border-medium hover:bg-bg-elevated",
        glow && "glow-accent",
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
    >
      {children}
    </motion.div>
  );
}
