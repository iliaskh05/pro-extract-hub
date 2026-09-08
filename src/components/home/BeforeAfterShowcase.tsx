import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { GALLERY } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Preuve visuelle immersive : slider plein largeur, onglets légers. */
export function BeforeAfterShowcase() {
  const [index, setIndex] = useState(0);
  const item = GALLERY[index] ?? GALLERY[0]!;

  return (
    <section className="bg-ink text-ink-foreground" data-header-tone="dark">
      <div className="shell section-y pb-8 lg:pb-10">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Avant / Après"
            title="Sale → propre : glissez le curseur."
            description="Même cadrage. Tirez la poignée pour voir l'encrassement puis le résultat."
          />
        </Reveal>

        <Reveal delay={60} className="mt-8">
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Choisir un élément">
            {GALLERY.map((g, i) => (
              <button
                key={g.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold tracking-[0.06em] uppercase transition-colors duration-300",
                  i === index
                    ? "bg-white text-ink"
                    : "text-white/50 hover:bg-white/10 hover:text-white",
                )}
              >
                {g.type}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="relative">
        <BeforeAfterSlider
          key={item.slug}
          before={item.before}
          after={item.after}
          alt={item.title}
          objectPosition={item.objectPosition}
          beforeTreatment={item.beforeTreatment}
          className="rounded-none sm:aspect-[21/9]"
        />
      </Reveal>

      <div className="shell pt-5 pb-16 lg:pb-24">
        <Reveal delay={80}>
          <p className="max-w-xl text-sm text-white/55">
            <span className="font-medium text-white/85">{item.title}</span> — {item.text}
            {item.demonstration ? " (démonstration visuelle)." : ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
