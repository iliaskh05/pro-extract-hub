import { Link } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/site";
import { SERVICE_VISUALS } from "@/lib/media";
import { cn } from "@/lib/utils";

export function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  const current = SERVICES[active]!;
  const visual = SERVICE_VISUALS[current.slug]!;

  useLayoutEffect(() => {
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    if (item) setIndicator({ top: item.offsetTop, height: item.offsetHeight });
  }, [active]);

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">Prestations</p>
            <h2 className="mt-4 max-w-xl text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
              Chaque élément de votre installation
            </h2>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Toutes les prestations
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="relative order-2 lg:order-1 lg:col-span-5">
            <span
              className="absolute left-0 w-0.5 rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ top: indicator.top, height: indicator.height }}
              aria-hidden="true"
            />
            <ul ref={listRef} className="border-l border-border">
              {SERVICES.map((s, i) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-4 py-5 pl-6 text-left transition-all duration-300",
                      i === active
                        ? "translate-x-1 text-foreground"
                        : "text-muted-foreground hover:translate-x-1 hover:text-foreground",
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg font-medium tracking-tight md:text-xl">
                        {s.title}
                      </span>
                    </span>
                    <ArrowRight
                      className={cn(
                        "size-4 shrink-0 transition-all duration-300",
                        i === active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                      )}
                    />
                  </button>
                  {i === active && (
                    <p className="step-in pb-5 pl-6 text-sm leading-relaxed text-muted-foreground lg:hidden">
                      {s.short}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div key={current.slug} className="step-in">
              <figure className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={visual.image}
                  alt={visual.alt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <figcaption className="absolute top-4 left-4 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase backdrop-blur">
                  Photo réelle
                </figcaption>
              </figure>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{current.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: current.slug }}
                    className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                  >
                    Voir la prestation
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
                <ul className="space-y-2.5 border-t border-border pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                  {current.points.slice(0, 4).map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
