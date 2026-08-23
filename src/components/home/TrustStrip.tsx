import { Reveal } from "@/components/Reveal";

const PILLARS = [
  { word: "Professionnel", note: "Intervention encadrée" },
  { word: "Documenté", note: "Photos avant / après" },
  { word: "Traçable", note: "Rapport d'intervention" },
  { word: "Suivi", note: "Prochaine échéance" },
];

export function TrustStrip() {
  return (
    <section
      id="preuves"
      className="border-b border-ink-border bg-ink"
      aria-label="Nos engagements"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-6 sm:gap-x-8">
          {PILLARS.map((p, i) => (
            <Reveal
              as="li"
              key={p.word}
              delay={i * 110}
              className="flex items-baseline gap-5 sm:gap-8"
            >
              <span className="block">
                <span className="block text-2xl font-semibold tracking-[-0.04em] text-ink-foreground sm:text-3xl lg:text-[2.75rem] lg:leading-none">
                  {p.word}
                </span>
                <span className="mt-2 block text-[11px] tracking-[0.16em] text-ink-muted uppercase">
                  {p.note}
                </span>
              </span>
              {i < PILLARS.length - 1 && (
                <span
                  className="text-2xl font-light text-accent/50 sm:text-3xl lg:text-4xl"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <div className="mt-12 h-px w-full origin-left bg-ink-border" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-muted">
            Nous démarrons notre activité en septembre 2026 avec une exigence simple : une
            intervention technique, et la preuve de ce qui a été fait.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
