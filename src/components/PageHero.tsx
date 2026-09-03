import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  image,
  imageAlt,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
  compact?: boolean;
}) {
  return (
    <section className="surface-ink hero-bleed relative overflow-hidden" data-header-tone="dark">
      <div id="hero-sentinel" className="absolute top-0 h-24 w-full" aria-hidden="true" />
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ""}
          fetchPriority="high"
          className="hero-media absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-br from-ink via-ink/88 to-ink/45"
        aria-hidden="true"
      />
      <div className="grid-tech absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative mx-auto max-w-7xl px-5 lg:px-8",
          compact ? "pt-28 pb-16 lg:pt-36 lg:pb-20" : "pt-32 pb-20 lg:pt-44 lg:pb-28",
        )}
      >
        <p className="hero-copy eyebrow text-accent" style={{ animationDelay: "0.1s" }}>
          {eyebrow}
        </p>
        <h1
          className="hero-line mt-5 max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-ink-foreground sm:text-5xl lg:text-[4rem]"
          style={{ animationDelay: "0.24s" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="hero-copy mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg"
            style={{ animationDelay: "0.42s" }}
          >
            {description}
          </p>
        )}
        {children && (
          <div className="hero-copy mt-9" style={{ animationDelay: "0.56s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
