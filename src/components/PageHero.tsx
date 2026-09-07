import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Hero de page interne : clair, sobre, une seule idée. */
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
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className={cn(
          "shell relative grid items-center gap-10 lg:gap-16",
          image && "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]",
          compact ? "py-14 lg:py-20" : "py-16 lg:py-28",
        )}
      >
        <div>
          <p className="hero-copy eyebrow text-accent" style={{ animationDelay: "0.1s" }}>
            {eyebrow}
          </p>
          <h1
            className="hero-line mt-5 max-w-2xl text-[2rem] leading-[1.05] font-semibold tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]"
            style={{ animationDelay: "0.22s" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="hero-copy mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.36s" }}
            >
              {description}
            </p>
          )}
          {children && (
            <div className="hero-copy mt-9" style={{ animationDelay: "0.5s" }}>
              {children}
            </div>
          )}
        </div>

        {image && (
          <figure className="hero-copy overflow-hidden rounded-sm border border-border" style={{ animationDelay: "0.42s" }}>
            <img
              src={image}
              alt={imageAlt ?? ""}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
            />
          </figure>
        )}
      </div>
    </section>
  );
}
