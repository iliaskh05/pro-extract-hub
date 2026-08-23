import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FranceMap } from "@/components/FranceMap";
import { ZONES } from "@/lib/site";

type ZoneSlug = (typeof ZONES)[number]["slug"];

export function ZonesSection() {
  const [hovered, setHovered] = useState<ZoneSlug | undefined>(undefined);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-accent">Zones d'intervention</p>
            <h2 className="mt-4 text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
              Deux pôles, une même exigence
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Nous n'annonçons que les zones réellement desservies. En limite de secteur, la
              faisabilité est confirmée avant toute proposition.
            </p>

            <div className="mt-10">
              {ZONES.map((z) => (
                <Link
                  key={z.slug}
                  to="/zones/$slug"
                  params={{ slug: z.slug }}
                  onMouseEnter={() => setHovered(z.slug)}
                  onMouseLeave={() => setHovered(undefined)}
                  onFocus={() => setHovered(z.slug)}
                  onBlur={() => setHovered(undefined)}
                  className="group flex items-start justify-between gap-6 border-t border-border py-6 transition-colors last:border-b hover:border-accent/40"
                >
                  <span>
                    <span className="block text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                      {z.name}
                    </span>
                    <span className="mt-1.5 block max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {z.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <FranceMap highlight={hovered} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
