"use client";

interface TrackedLinkProps {
  id: string;
  title: string;
  url: string;
  emoji: string | null;
  index: number;
}

export default function TrackedLink({ id, title, url, emoji, index }: TrackedLinkProps) {
  const handleClick = () => {
    try {
      navigator.sendBeacon(`/api/link-click/${id}`);
    } catch {
      fetch(`/api/link-click/${id}`, { method: "POST", keepalive: true });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-in-bio-item flex items-center justify-center gap-2.5 w-full rounded-xl
                 py-3.5 px-4 text-sm font-medium
                 bg-bg-surface border border-border-subtle
                 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10
                 hover:scale-[1.02] active:scale-[0.98]
                 transition-all duration-200
                 text-text-primary"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {emoji && <span className="text-lg">{emoji}</span>}
      <span>{title}</span>
    </a>
  );
}
