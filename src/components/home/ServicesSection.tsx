import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/site";
import { SERVICE_ICONS } from "@/lib/ui-icons";
import { SERVICE_VISUALS } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Prestations : une seule scène photo qui se fond avec la liste
 * (crossfade au survol) — plus de tuile photo détachée.
 */
export function ServicesSection() {
  const [active, setActive] = useState(0);
  const current = SERVICES[active] ?? SERVICES[0];
  if (!current) return null;
  const visual = SERVICE_VISUALS[current.slug];

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground" data-header-tone="dark">
      {/* Photos fusionnées en fond */}
      <div className="absolute inset-0" aria-hidden="true">
        {SERVICES.map((s, i) => {
          const v = SERVICE_VISUALS[s.slug];
          if (!v) return null;
          return (
            <img
              key={s.slug}
              src={v.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/95 via-[#0a0c10]/78 to-[#0a0c10]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/90 via-transparent to-[#0a0c10]/40" />
      </div>

      <div className="shell relative section-y">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Nos prestations"
            title="Ce que nous traitons"
            description="Survolez une prestation : la photo se fond dans la scène."
          />
        </Reveal>

        <div className="mt-12 grid items-end gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <ul className="space-y-1">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.slug];
              const on = i === active;
              return (
                <Reveal as="li" key={s.slug} delay={i * 40}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={cn(
                      "group flex items-center gap-4 border-b border-white/10 py-4 transition-colors duration-300",
                      on ? "border-white/30" : "hover:border-white/20",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-sm transition-colors",
                        on ? "bg-white/15 text-white" : "text-white/45 group-hover:text-white/70",
                      )}
                    >
                      {Icon && <Icon className="size-4 stroke-[1.5]" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "font-display block text-lg font-bold tracking-[-0.03em] transition-colors sm:text-xl",
                          on ? "text-white" : "text-white/55 group-hover:text-white/80",
                        )}
                      >
                        {s.title}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-sm transition-colors",
                          on ? "text-white/65" : "text-white/35",
                        )}
                      >
                        {s.short}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-4 shrink-0 transition-all duration-300",
                        on
                          ? "translate-x-0 text-white opacity-100"
                          : "-translate-x-1 text-white/30 opacity-0 group-hover:opacity-60",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={100} className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden">
              {visual && (
                <img
                  src={visual.image}
                  alt={visual.alt}
                  className="h-full w-full object-cover"
                  key={current.slug}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/70 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-6 text-sm text-white/80">
                <span className="font-display text-lg font-bold text-white">{current.title}</span>
                <span className="mt-1 block text-xs tracking-[0.14em] text-white/50 uppercase">
                  {visual?.caption}
                </span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-10">
          <Button asChild variant="inverse" size="lg" className="group h-12 px-6">
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
