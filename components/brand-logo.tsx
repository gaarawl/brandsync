import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Size in Tailwind units, applied to the outer square (default h-8 w-8) */
  size?: string;
};

/**
 * BrandSync logo: violet octahedron diamond inside a dark rounded square.
 * Drop-in replacement for the old Sparkles-based logo mark.
 */
export function BrandLogo({ className, size = "h-8 w-8" }: Props) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0B0B13] shadow-lg shadow-accent/30",
        size,
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bl-tl" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="bl-tr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="bl-bl" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <linearGradient id="bl-br" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M16 5 L8 16 L16 16 Z" fill="url(#bl-tl)" />
        <path d="M16 5 L24 16 L16 16 Z" fill="url(#bl-tr)" />
        <path d="M8 16 L16 27 L16 16 Z" fill="url(#bl-bl)" />
        <path d="M24 16 L16 27 L16 16 Z" fill="url(#bl-br)" />
      </svg>
    </div>
  );
}
