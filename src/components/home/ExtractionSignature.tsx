import { useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    n: "01",
    title: "Hotte & accumulation",
    text: "Les dépôts gras se fixent sur les filtres, dans le plénum puis le long du conduit. L'extraction perd en efficacité sans que rien ne le signale clairement.",
  },
  {
    n: "02",
    title: "Dégraissage",
    text: "Chaque élément accessible est traité : hotte, filtres, conduit, moteur et caisson, selon la configuration et l'accessibilité de l'installation.",
  },
  {
    n: "03",
    title: "Documentation & suivi",
    text: "L'état constaté est photographié, daté et consigné. Vous conservez un compte rendu et une prochaine échéance, pas seulement une surface propre.",
  },
];

const FLOW_LINES = [95, 135, 175, 230, 268];

function flowPath(x: number) {
  return `M ${x} 322 C ${x} 268, ${x + (205 - x) * 0.4} 226, 205 176 L 205 62 Q 205 46 221 46 L 348 46`;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function ExtractionSignature() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useScrollProgress(trackRef, (p) => {
    const node = stageRef.current;
    if (node) {
      // L'encrassement se dissipe pendant la phase d'intervention.
      node.style.setProperty("--grime", (1 - clamp((p - 0.34) / 0.3)).toFixed(3));
      node.style.setProperty("--flow", (0.25 + clamp((p - 0.3) / 0.5) * 0.75).toFixed(3));
      node.style.setProperty("--sweep", clamp((p - 0.34) / 0.3).toFixed(3));
      node.style.setProperty("--clean", clamp((p - 0.62) / 0.25).toFixed(3));
    }
    const next = p < 0.34 ? 0 : p < 0.64 ? 1 : 2;
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      ref={trackRef}
      className="surface-ink relative h-[220vh] lg:h-[340vh]"
      aria-label="Le parcours de l'air dans votre système d'extraction"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="grid-tech absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-accent">Le trajet de l'air</p>
            <h2 className="mt-3 max-w-md text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.04em] text-ink-foreground sm:text-4xl lg:mt-4 lg:text-[3.25rem]">
              De l'accumulation à l'extraction rétablie.
            </h2>

            <ol className="mt-5 space-y-1 lg:mt-12">
              {STAGES.map((s, i) => (
                <li key={s.n}>
                  <div
                    className={cn(
                      "border-l-2 py-2.5 pl-5 transition-all duration-700 lg:py-4",
                      i === active ? "border-accent opacity-100" : "border-ink-border opacity-35",
                    )}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                        {s.n}
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight text-ink-foreground lg:text-xl">
                        {s.title}
                      </h3>
                    </div>
                    {i === active && (
                      <p
                        key={s.n}
                        className="step-in mt-2 max-w-sm text-[13px] leading-relaxed text-ink-muted sm:text-sm"
                      >
                        {s.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div ref={stageRef} className="order-1 lg:order-2">
            <svg
              viewBox="0 0 420 340"
              className="mx-auto h-auto max-h-[30svh] w-full max-w-lg lg:max-h-none"
              role="img"
              aria-label="Schéma d'un système d'extraction : hotte, filtres, conduit et caisson moteur"
            >
              <defs>
                <linearGradient id="sig-flow" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.74 0.1 198)" stopOpacity="0.15" />
                  <stop offset="60%" stopColor="oklch(0.74 0.1 198)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.9 0.06 198)" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Flux d'air */}
              <g
                fill="none"
                stroke="url(#sig-flow)"
                strokeWidth="1.6"
                strokeLinecap="round"
                style={{ opacity: "var(--flow, 0.25)" }}
              >
                {FLOW_LINES.map((x, i) => (
                  <path
                    key={x}
                    d={flowPath(x)}
                    className="airflow-line"
                    style={{ animationDelay: `${i * 0.55}s` }}
                  />
                ))}
              </g>

              {/* Conduit + caisson moteur */}
              <g
                fill="none"
                stroke="oklch(0.98 0.004 240 / 0.55)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              >
                <path d="M186 122 L186 30 L318 30 M224 122 L224 62 L318 62" />
                <rect x="318" y="18" width="72" height="56" rx="6" />
                <circle cx="354" cy="46" r="15" />
                <path d="M354 33 L354 59 M341 46 L367 46" strokeWidth="1" />
              </g>

              {/* Hotte */}
              <g
                fill="none"
                stroke="oklch(0.98 0.004 240 / 0.7)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              >
                <path d="M70 122 L340 122 L316 186 L94 186 Z" />
                <path d="M94 186 L316 186" />
              </g>

              {/* Filtres à chocs */}
              <g stroke="oklch(0.98 0.004 240 / 0.5)" strokeWidth="2.4" strokeLinecap="round">
                {Array.from({ length: 11 }).map((_, i) => (
                  <path key={i} d={`M${112 + i * 18} 180 L${122 + i * 18} 146`} />
                ))}
              </g>

              {/* Encrassement — disparaît pendant l'intervention */}
              <g
                stroke="var(--color-grime)"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ opacity: "var(--grime, 1)", transition: "opacity 120ms linear" }}
              >
                {Array.from({ length: 11 }).map((_, i) => (
                  <path key={i} d={`M${112 + i * 18} 180 L${122 + i * 18} 146`} opacity="0.75" />
                ))}
                <path d="M188 118 L188 34 M222 118 L222 62" strokeWidth="4" opacity="0.6" />
                <path d="M96 184 L314 184" strokeWidth="3" opacity="0.5" />
              </g>

              {/* Passe d'intervention */}
              <g
                style={{
                  opacity: "calc(var(--sweep, 0) * (1 - var(--sweep, 0)) * 4)",
                  transform: "translateY(calc((1 - var(--sweep, 0)) * 60px))",
                }}
              >
                <rect x="70" y="120" width="270" height="3" fill="oklch(0.9 0.08 198)" rx="1.5" />
              </g>

              {/* État final */}
              <g
                fill="none"
                stroke="oklch(0.74 0.1 198)"
                strokeWidth="1.6"
                style={{ opacity: "var(--clean, 0)" }}
              >
                <path d="M70 122 L340 122 L316 186 L94 186 Z" />
              </g>

              {/* Plan de cuisson */}
              <g stroke="oklch(0.98 0.004 240 / 0.35)" strokeWidth="1.4" fill="none">
                <path d="M78 322 L332 322" />
                <path d="M110 322 L110 310 M160 322 L160 310 M250 322 L250 310 M300 322 L300 310" />
              </g>
            </svg>

            <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-ink-muted uppercase lg:mt-4">
              Schéma de principe — représentation simplifiée
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
