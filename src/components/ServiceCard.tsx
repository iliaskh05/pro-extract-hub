import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bloc de prestation : icône fine, titre court, une phrase, un lien. */
export function ServiceCard({
  icon: Icon,
  title,
  text,
  slug,
  className,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  slug: string;
  className?: string;
}) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug }}
      className={cn(
        "group flex h-full flex-col bg-background p-6 transition-colors duration-300 hover:bg-secondary/60 lg:p-8",
        className,
      )}
    >
      <Icon
        className="size-6 stroke-[1.4] text-accent transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
      <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        Découvrir
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
