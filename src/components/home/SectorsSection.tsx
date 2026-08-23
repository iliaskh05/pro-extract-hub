import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SECTORS } from "@/lib/media";
import { cn } from "@/lib/utils";

// Composition éditoriale à partir de md : deux formats larges, trois portraits, deux larges.
const LAYOUT = [
  "md:col-span-3 md:aspect-[16/11]",
  "md:col-span-3 md:aspect-[16/11]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-3 md:aspect-[16/11]",
  "md:col-span-3 md:aspect-[16/11]",
];

export function SectorsSection() {
  return (
    <section className="surface-ink relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">Secteurs</p>
          <h2 className="mt-4 text-3xl leading-[1.04] font-semibold tracking-[-0.04em] text-ink-foreground sm:text-5xl">
            Les établissements que nous accompagnons
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {SECTORS.map((s, i) => (
            <Reveal key={s.name} delay={i * 60} className={cn("aspect-[4/5]", LAYOUT[i])}>
              <Link
                to="/devis"
                data-cursor="Explorer"
                className="group cursor-swap relative block h-full w-full overflow-hidden rounded-2xl border border-ink-border"
              >
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  style={{ objectPosition: s.position }}
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95"
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <span className="text-base font-semibold tracking-tight text-ink-foreground transition-transform duration-500 ease-out group-hover:-translate-y-1 md:text-lg">
                    {s.name}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-ink-foreground/70 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-1.5 group-hover:text-ink-foreground" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
