import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Étape de méthode : numéro, icône, titre court, une phrase. */
export function TimelineStep({
  n,
  title,
  text,
  icon: Icon,
  tone = "light",
  className,
}: {
  n: string;
  title: string;
  text: string;
  icon?: LucideIcon;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "relative flex h-full flex-col pt-6 pl-6 lg:pl-0 lg:pt-8",
        "before:absolute before:top-0 before:left-0 before:h-full before:w-px lg:before:h-px lg:before:w-full",
        dark ? "before:bg-ink-border" : "before:bg-border",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0 left-0 h-px w-px lg:h-px",
          dark ? "bg-accent" : "bg-accent",
        )}
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.22em] text-accent">{n}</span>
        {Icon && (
          <Icon
            className={cn(
              "size-4 stroke-[1.4]",
              dark ? "text-ink-muted" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
        )}
      </div>
      <h3
        className={cn(
          "mt-4 text-base font-semibold tracking-[-0.02em] sm:text-lg",
          dark ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-xs text-sm leading-relaxed",
          dark ? "text-ink-muted" : "text-muted-foreground",
        )}
      >
        {text}
      </p>
    </div>
  );
}
