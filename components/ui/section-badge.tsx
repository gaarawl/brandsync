interface SectionBadgeProps {
  children: React.ReactNode;
}

export default function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent uppercase">
      {children}
    </span>
  );
}
