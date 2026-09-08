import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { SECTOR_MEDIA } from "@/lib/sector-media";
import { SECTORS } from "@/lib/sectors";

const HOME_SLUGS = ["restaurant", "hotel", "fast-food", "cuisine-collective"] as const;

/** Secteurs en bandeau photo continu — pas de grille de cartes bordées. */
export function SectorsSection() {
  const featured = HOME_SLUGS.map((slug) => SECTORS.find((s) => s.slug === slug)).filter(
    Boolean,
  ) as typeof SECTORS;

  return (
    <section className="bg-background">
      <div className="shell section-y pb-8 lg:pb-10">
        <Reveal>
          <SectionHeading
            eyebrow="Secteurs"
            title="Les établissements que nous accompagnons"
            description="Une même ligne visuelle : la photo porte le secteur, le texte se fond dessus."
          />
        </Reveal>
      </div>

      <Reveal delay={60}>
        <div className="flex gap-0 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((s) => {
            const media = SECTOR_MEDIA[s.slug];
            return (
              <Link
                key={s.slug}
                to="/secteurs/$slug"
                params={{ slug: s.slug }}
                className="group relative h-[22rem] w-[78vw] shrink-0 snap-center overflow-hidden sm:h-[26rem] sm:w-[48vw] lg:h-[32rem] lg:w-[28vw] lg:snap-start"
              >
                {media ? (
                  <img
                    src={media.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: media.position }}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="absolute inset-0 bg-secondary" />
                )}
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/88 via-[#0a0c10]/25 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 lg:p-7">
                  <span>
                    <span className="block text-[10px] tracking-[0.2em] text-white/55 uppercase">
                      Secteur
                    </span>
                    <span className="font-display mt-1.5 block text-xl font-bold tracking-[-0.03em] text-white sm:text-2xl">
                      {s.name}
                    </span>
                  </span>
                  <ArrowUpRight className="mb-1 size-5 text-white/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      <div className="shell pt-8 pb-16 lg:pb-24">
        <Reveal delay={100}>
          <Button asChild variant="outline" size="lg" className="group h-12 px-6">
            <Link to="/secteurs">
              Voir tous les secteurs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
