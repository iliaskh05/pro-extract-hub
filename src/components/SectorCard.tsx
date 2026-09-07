import { Link } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTOR_MEDIA } from "@/lib/sector-media";
import type { Sector } from "@/lib/sectors";

/**
 * Vignette secteur — photo réelle quand elle existe,
 * vignette technique bleutée sinon (aucune image générée).
 */
export function SectorCard({
  sector,
  icon: Icon,
  featured = false,
  className,
}: {
  sector: Sector;
  icon: LucideIcon;
  featured?: boolean;
  className?: string;
}) {
  const media = SECTOR_MEDIA[sector.slug];

  return (
    <Link
      to="/secteurs/$slug"
      params={{ slug: sector.slug }}
      className={cn(
        "group relative block h-full overflow-hidden rounded-sm border border-border bg-secondary/50",
        className,
      )}
    >
      {media ? (
        <>
          <img
            src={media.image}
            alt={`Secteur ${sector.name} — installation d'extraction`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            style={{ objectPosition: media.position }}
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-[#0b2433]/85 via-[#0b2433]/25 to-transparent transition-opacity duration-500 group-hover:from-[#0b2433]/90"
            aria-hidden="true"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-6">
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/70 uppercase">
                <Icon className="size-3.5 stroke-[1.5]" aria-hidden="true" />
                Secteur
              </span>
              <span
                className={cn(
                  "mt-1.5 block font-semibold tracking-[-0.02em] text-white transition-transform duration-500 group-hover:-translate-y-0.5",
                  featured ? "text-xl lg:text-2xl" : "text-base lg:text-lg",
                )}
              >
                {sector.name}
              </span>
              {featured && (
                <span className="mt-2 block max-w-sm text-sm leading-relaxed text-white/75">
                  {sector.description.split(".")[0]}.
                </span>
              )}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-white/70 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-0.5 group-hover:text-white" />
          </span>
        </>
      ) : (
        <span className="grid-blue flex h-full flex-col justify-between p-5 transition-colors duration-500 group-hover:bg-secondary lg:p-6">
          <Icon
            className="size-5 stroke-[1.4] text-accent transition-transform duration-500 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
          <span className="mt-10 block">
            <span className="block text-base font-semibold tracking-[-0.02em] lg:text-lg">
              {sector.name}
            </span>
            <span className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              Voir le secteur
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
