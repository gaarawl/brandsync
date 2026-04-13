"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// ── Set your launch date here ──
const LAUNCH_DATE = new Date("2025-06-01T00:00:00");

function getTimeLeft() {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -inset-2 rounded-2xl bg-violet-500/20 blur-xl" />
        <div className="relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border border-violet-500/30 bg-black/40 backdrop-blur-sm shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <span className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-violet-300/70">
        {label}
      </span>
    </div>
  );
}

export default function ComingSoonPage() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6">
      {/* Animated orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px] animate-pulse [animation-delay:1s]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/5 blur-[80px] animate-pulse [animation-delay:2s]" />

      {/* Noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjAzIi8+PC9zdmc+')] opacity-50" />

      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-violet-500/30 blur-md" />
            <Sparkles className="relative h-8 w-8 text-violet-400" />
          </div>
          <span className="text-2xl font-bold text-white">
            Brand<span className="text-violet-400">Sync</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-4xl sm:text-6xl font-bold text-white">
          Bientôt{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            disponible
          </span>
        </h1>
        <p className="mb-12 max-w-md text-base sm:text-lg text-violet-200/50">
          Le back-office des créateurs modernes arrive.
          Prépare-toi à tout centraliser.
        </p>

        {/* Countdown */}
        <div className="flex items-center gap-4 sm:gap-8">
          <TimeBlock value={time.days} label="Jours" />
          <span className="text-3xl sm:text-5xl font-light text-violet-500/40 -mt-6">:</span>
          <TimeBlock value={time.hours} label="Heures" />
          <span className="text-3xl sm:text-5xl font-light text-violet-500/40 -mt-6">:</span>
          <TimeBlock value={time.minutes} label="Minutes" />
          <span className="text-3xl sm:text-5xl font-light text-violet-500/40 -mt-6">:</span>
          <TimeBlock value={time.seconds} label="Secondes" />
        </div>

        {/* Newsletter placeholder — uncomment when ready */}
        {/* <div className="mt-12 flex w-full max-w-sm gap-2">
          <input
            type="email"
            placeholder="ton@email.com"
            className="flex-1 rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-violet-300/30 outline-none focus:border-violet-500/50 backdrop-blur-sm"
          />
          <button className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/25">
            Notifier
          </button>
        </div> */}

        {/* Footer */}
        <p className="mt-16 text-xs text-violet-300/20">
          &copy; {new Date().getFullYear()} BrandSync. Tous droits r&eacute;serv&eacute;s.
        </p>
      </div>
    </div>
  );
}
