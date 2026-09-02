import { Reveal } from "@/components/Reveal";
import { zonesHeroLine } from "@/lib/site";

const ITEMS = [
  "Intervention professionnelle",
  "Photos avant / après",
  "Documentation d'intervention",
  "Suivi périodique",
] as const;

export function TrustStrip() {
  return (
    <section
      id="preuves"
      className="border-b border-ink-border bg-ink"
      aria-label="Nos engagements"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 50}>
              <span className="flex items-center gap-3 text-sm font-medium text-ink-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={120}>
          <p className="mt-6 text-center text-[11px] tracking-[0.18em] text-ink-muted uppercase sm:text-left">
            {zonesHeroLine()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
