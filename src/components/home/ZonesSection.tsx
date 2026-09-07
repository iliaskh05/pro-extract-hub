import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FranceMap } from "@/components/FranceMap";
import { activeZones, type ZoneSlug } from "@/lib/site";

export function ZonesSection() {
  const [hovered, setHovered] = useState<ZoneSlug | undefined>(undefined);

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="shell section-y">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Zones d'intervention"
              title="Où nous intervenons"
              description="Nous n'annonçons que les secteurs réellement desservis. Paris et l'Île-de-France sont traités comme deux périmètres distincts."
            />

            <div className="mt-10">
              {activeZones().map((z) => (
                <Link
                  key={z.slug}
                  to="/zones/$slug"
                  params={{ slug: z.slug }}
                  onMouseEnter={() => setHovered(z.slug)}
                  onMouseLeave={() => setHovered(undefined)}
                  onFocus={() => setHovered(z.slug)}
                  onBlur={() => setHovered(undefined)}
                  className="group flex items-center justify-between gap-6 border-t border-border py-5 transition-colors last:border-b hover:border-foreground/25"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1">
                      {z.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{z.region}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
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
