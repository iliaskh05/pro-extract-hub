import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("group flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition-transform duration-300 group-hover:-translate-y-0.5",
          inverted ? "bg-ink-foreground/10 text-ink-foreground" : "bg-ink text-ink-foreground",
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 8.5 12 4l8 4.5M6 10.5V19h12v-8.5M9.5 19v-4.5h5V19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2v3.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block text-[15px] font-semibold tracking-tight",
            inverted ? "text-ink-foreground" : "text-foreground",
          )}
        >
          Extraction<span className="text-accent">Pro</span>
        </span>
        <span
          className={cn(
            "block text-[10px] tracking-[0.2em] uppercase",
            inverted ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          Extraction · Maintenance
        </span>
      </span>
    </span>
  );
}
