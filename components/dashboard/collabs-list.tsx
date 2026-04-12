"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type CollabItem = {
  id: string;
  brand: string;
  platform: string;
  status: string;
  statusColor: string;
  date: string;
  amount: string;
  brandName: string;
};

const avatarColors = [
  "bg-gradient-to-br from-red-500/40 to-orange-500/40",
  "bg-gradient-to-br from-pink-500/40 to-purple-500/40",
  "bg-gradient-to-br from-emerald-500/40 to-teal-500/40",
  "bg-gradient-to-br from-blue-500/40 to-cyan-500/40",
  "bg-gradient-to-br from-violet-500/40 to-indigo-500/40",
  "bg-gradient-to-br from-sky-500/40 to-blue-500/40",
  "bg-gradient-to-br from-amber-500/40 to-yellow-500/40",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function CollabsList({ collabs }: { collabs: CollabItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card-premium rounded-xl shimmer-line"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-text-primary tracking-tight">
          Collaborations en cours
        </h2>
        <Link
          href="/dashboard/collaborations"
          className="text-xs text-accent hover:text-accent-glow transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="divide-y divide-border-subtle">
        {collabs.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            Aucune collaboration. Ajoutez-en une !
          </div>
        ) : (
          collabs.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-9 w-9 rounded-lg shrink-0 ${getAvatarColor(c.brandName)} flex items-center justify-center text-xs font-bold text-white/80`}
                >
                  {c.brandName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {c.brand}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {c.platform}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-block ${c.statusColor}`}
                >
                  {c.status}
                </span>
                <span className="hidden text-xs text-text-muted md:block w-14 text-right">
                  {c.date}
                </span>
                <span className="hidden text-xs font-medium text-text-primary lg:block w-16 text-right">
                  {c.amount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
