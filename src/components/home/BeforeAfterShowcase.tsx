import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { GALLERY } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Preuve visuelle principale : le résultat, en grand, comparable au doigt ou à la souris. */
export function BeforeAfterShowcase() {
  const [index, setIndex] = useState(0);
  const item = GALLERY[index] ?? GALLERY[0]!;

  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Avant / Après"
            title="Voyez la différence."
            description="Glissez la poignée : même cadrage, avant et après intervention."
          />
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choisir un élément">
            {GALLERY.map((g, i) => (
              <button
                key={g.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded-sm border px-4 py-2 text-xs font-medium tracking-[0.04em] transition-all duration-300",
                  i === index
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground",
                )}
              >
                {g.type}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative mt-6 lg:mt-8" variant="mask">
          <BeforeAfterSlider
            key={item.slug}
            before={item.before}
            after={item.after}
            alt={item.title}
            objectPosition={item.objectPosition}
            beforeTreatment={item.beforeTreatment}
            className="rounded-sm border border-border"
          />
          {item.demonstration && (
            <p className="absolute top-4 left-4 z-10 rounded-sm border border-border bg-background/90 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-foreground uppercase backdrop-blur">
              Démonstration visuelle
            </p>
          )}
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{item.title}</span> — {item.text}
            {item.demonstration ? " (démonstration — photos d'intervention réelles à venir)." : ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
