import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        centered && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-accent uppercase">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="text-base text-text-secondary leading-relaxed sm:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
