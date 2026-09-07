import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/site";
import { SERVICE_ICONS } from "@/lib/ui-icons";
import { SERVICE_VISUALS } from "@/lib/media";

/**
 * Composition éditoriale : une prestation dominante en visuel,
 * les autres en liste technique dense avec interaction au survol.
 */
export function ServicesSection() {
  const [lead, ...others] = SERVICES;
  if (!lead) return null;

  const LeadIcon = SERVICE_ICONS[lead.slug];
  const visual = SERVICE_VISUALS[lead.slug];

  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Nos prestations"
            title="Ce que nous traitons"
            description="Chaque intervention porte sur les éléments réellement accessibles de votre installation."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Link
              to="/services/$slug"
              params={{ slug: lead.slug }}
              className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-sm border border-border"
            >
              {visual && (
                <img
                  src={visual.image}
                  alt={visual.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
              )}
              <span
                className="absolute inset-0 bg-gradient-to-t from-[#0b2433]/90 via-[#0b2433]/35 to-transparent"
                aria-hidden="true"
              />
              <span className="relative p-6 lg:p-8">
                {LeadIcon && (
                  <LeadIcon
                    className="size-6 stroke-[1.4] text-white transition-transform duration-500 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
                <span className="mt-5 block text-xl font-semibold tracking-[-0.02em] text-white lg:text-2xl">
                  {lead.title}
                </span>
                <span className="mt-2 block max-w-sm text-sm leading-relaxed text-white/75">
                  {lead.short}
                </span>
                <span className="mt-5 flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-white uppercase">
                  Découvrir
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </Reveal>

          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {others.map((s, i) => {
                const Icon = SERVICE_ICONS[s.slug];
                return (
                  <Reveal as="li" key={s.slug} delay={i * 60} className="bg-background">
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="group relative flex h-full flex-col p-6 transition-colors duration-500 hover:bg-secondary/60 lg:p-7"
                    >
                      <span
                        className="absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-500 group-hover:w-full"
                        aria-hidden="true"
                      />
                      {Icon && (
                        <Icon
                          className="size-5 stroke-[1.4] text-accent transition-transform duration-500 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <span className="mt-5 block text-base font-semibold tracking-[-0.02em]">
                        {s.title}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                        {s.short}
                      </span>
                      <ArrowUpRight
                        className="mt-4 size-4 text-muted-foreground transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>

        <Reveal delay={120} className="mt-10">
          <Button asChild variant="outline" size="lg" className="group h-12 rounded-sm px-6">
            <Link to="/services">
              Voir le détail des prestations
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
