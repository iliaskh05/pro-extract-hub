import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Titre de section unique du design system.
 * Une seule idée par section : un label, un titre, une phrase.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", dark ? "text-accent" : "text-accent")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "font-display mt-4 text-[1.85rem] leading-[1.05] font-bold tracking-[-0.045em] sm:text-4xl lg:text-[2.85rem]",
          dark ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-xl text-[0.975rem] leading-[1.65] sm:text-base",
            align === "center" && "mx-auto",
            dark ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
