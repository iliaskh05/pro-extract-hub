import { useRef, useState } from "react";
import { CalendarClock, Camera, ClipboardCheck, ScanLine } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { MEDIA } from "@/lib/media";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    title: "Analyse",
    icon: ScanLine,
    text: "Relevé de la configuration : hotte, filtres, conduit, moteur, accès et contraintes du site.",
  },
  {
    n: "02",
    title: "Intervention",
    icon: ClipboardCheck,
    text: "Traitement des éléments concernés, dans le respect des supports et de la sécurité du poste.",
  },
  {
    n: "03",
    title: "Preuve",
    icon: Camera,
    text: "Photos avant / après et compte rendu des zones traitées, avec les points d'attention constatés.",
  },
  {
    n: "04",
    title: "Suivi",
    icon: CalendarClock,
    text: "Proposition de la prochaine échéance et conservation de l'historique de votre installation.",
  },
];

export function DocumentedSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useScrollProgress(trackRef, (p) => {
    const next = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section ref={trackRef} className="relative h-[260vh] bg-background lg:h-[380vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent">Méthode</p>
            <h2 className="mt-3 max-w-md text-[1.75rem] leading-[1.04] font-semibold tracking-[-0.04em] sm:text-4xl lg:mt-4 lg:text-[3.25rem]">
              Plus qu'un nettoyage.
              <span className="mt-1 block text-muted-foreground">Une extraction documentée.</span>
            </h2>

            {/* Mobile : une seule étape à la fois, avec une jauge de progression. */}
            <div className="mt-6 lg:hidden">
              <div className="flex gap-1.5" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-colors duration-500",
                      i <= active ? "bg-accent" : "bg-border",
                    )}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {STEPS[active]!.n}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{STEPS[active]!.title}</h3>
              </div>
              <p
                key={STEPS[active]!.n}
                className="step-in mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {STEPS[active]!.text}
              </p>
            </div>

            <ol className="mt-8 hidden lg:mt-12 lg:block">
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <div
                    className={cn(
                      "flex items-start gap-4 border-t border-border py-4 transition-opacity duration-500",
                      i === active ? "opacity-100" : "opacity-40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                        i === active
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      <s.icon className="size-4" />
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                          {s.n}
                        </span>
                        <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                      </div>
                      {i === active && (
                        <p className="step-in mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                          {s.text}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-secondary sm:aspect-[16/11]">
              <StageVisual index={0} active={active}>
                <img
                  src={MEDIA.ductDetail}
                  alt="Relevé technique d'une installation d'extraction"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <Caption>Relevé de l'installation</Caption>
              </StageVisual>

              <StageVisual index={1} active={active}>
                <img
                  src={MEDIA.beforeDuct}
                  alt="Traitement d'un conduit d'extraction — démonstration"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <Caption>Traitement des éléments accessibles</Caption>
              </StageVisual>

              <StageVisual index={2} active={active}>
                <div className="grid h-full w-full grid-cols-2 gap-px bg-ink-border">
                  <figure className="relative">
                    <img
                      src={MEDIA.beforeHood}
                      alt="Hotte avant intervention — démonstration"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <figcaption className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase">
                      Avant
                    </figcaption>
                  </figure>
                  <figure className="relative">
                    <img
                      src={MEDIA.afterHood}
                      alt="Hotte après intervention — démonstration"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <figcaption className="absolute top-3 left-3 rounded-full bg-ink-foreground/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase">
                      Après
                    </figcaption>
                  </figure>
                </div>
                <Caption>Documentation photo — démonstration</Caption>
              </StageVisual>

              <StageVisual index={3} active={active}>
                <img
                  src={MEDIA.afterMotor}
                  alt="Installation d'extraction suivie dans le temps"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />
                <div className="absolute inset-x-4 bottom-4 rounded-xl border border-ink-border bg-ink/85 p-4 backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-5">
                  <p className="text-[10px] tracking-[0.2em] text-ink-muted uppercase">
                    Historique de l'installation
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      "Intervention réalisée · rapport transmis",
                      "Points d'attention consignés",
                      "Prochaine échéance à planifier",
                    ].map((row) => (
                      <li
                        key={row}
                        className="flex items-center gap-2.5 text-xs text-ink-foreground"
                      >
                        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                        {row}
                      </li>
                    ))}
                  </ul>
                </div>
              </StageVisual>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageVisual({
  index,
  active,
  children,
}: {
  index: number;
  active: number;
  children: React.ReactNode;
}) {
  const isActive = index === active;
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        "absolute inset-0 transition-[opacity,transform] duration-700 ease-out",
        isActive ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 text-[10px] tracking-[0.2em] text-ink-foreground/85 uppercase">
      {children}
    </p>
  );
}
