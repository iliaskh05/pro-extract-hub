import { useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

/**
 * Visualisation technique du système d'extraction.
 * Lecture progressive au scroll : hotte → filtres → conduit → extraction → moteur.
 * Schéma de principe, sans mesure ni performance chiffrée.
 */
const STAGES = [
  {
    n: "01",
    key: "hotte",
    title: "Hotte",
    text: "Le point de captation. Les graisses en suspension se déposent sur les parois et le plénum.",
  },
  {
    n: "02",
    key: "filtres",
    title: "Filtres",
    text: "Première barrière. Un filtre saturé laisse passer davantage de dépôts vers le réseau.",
  },
  {
    n: "03",
    key: "conduit",
    title: "Conduit",
    text: "Le trajet de l'air. Les dépôts s'y accumulent sur les sections accessibles.",
  },
  {
    n: "04",
    key: "extraction",
    title: "Extraction",
    text: "Le flux entretenu conditionne le confort du poste de cuisson et l'évacuation des fumées.",
  },
  {
    n: "05",
    key: "moteur",
    title: "Moteur & caisson",
    text: "Le groupe moto-ventilateur. Nettoyé hors tension, après consignation lorsque nécessaire.",
  },
] as const;

const FLOW_X = [104, 146, 188, 236, 278];

function flowPath(x: number) {
  return `M ${x} 320 C ${x} 262, ${x + (206 - x) * 0.45} 224, 206 174 L 206 60 Q 206 44 222 44 L 344 44`;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

const ACCENT = "#1a3a8f";
const LINE = "#9fb4d8";

export function HoodVisualization() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useScrollProgress(trackRef, (p) => {
    const next = Math.min(STAGES.length - 1, Math.floor(clamp(p * 1.02) * STAGES.length));
    setActive((prev) => (prev === next ? prev : next));
  });

  const on = (key: (typeof STAGES)[number]["key"]) => STAGES[active]?.key === key;
  const seen = (i: number) => active >= i;

  return (
    <section
      ref={trackRef}
      className="surface-blue relative h-[200vh] lg:h-[300vh]"
      aria-label="Comprendre votre système d'extraction"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="grid-blue pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

        <div className="shell relative grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-accent">Le système</p>
            <h2 className="mt-4 max-w-md text-[1.75rem] leading-[1.06] font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
              De la hotte au moteur, un seul circuit.
            </h2>

            <ol className="mt-6 lg:mt-10">
              {STAGES.map((s, i) => (
                <li key={s.n}>
                  <div
                    className={cn(
                      "border-l-2 py-2.5 pl-5 transition-all duration-500 lg:py-3.5",
                      i === active
                        ? "border-accent opacity-100"
                        : "border-border opacity-45",
                    )}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                        {s.n}
                      </span>
                      <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                        {s.title}
                      </h3>
                    </div>
                    {i === active && (
                      <p className="step-in mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                        {s.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="order-1 lg:order-2">
            <svg
              viewBox="0 0 420 340"
              className="mx-auto h-auto max-h-[34svh] w-full max-w-xl lg:max-h-none"
              role="img"
              aria-label="Schéma d'un système d'extraction : hotte, filtres, conduit, extraction et caisson moteur"
            >
              {/* Flux d'air */}
              <g
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.3"
                strokeLinecap="round"
                className="transition-opacity duration-700"
                style={{ opacity: seen(3) ? 0.75 : 0.2 }}
              >
                {FLOW_X.map((x, i) => (
                  <path
                    key={x}
                    d={flowPath(x)}
                    className="flow-dash"
                    style={{ animationDelay: `${i * 0.6}s` }}
                  />
                ))}
              </g>

              {/* Conduit + caisson moteur */}
              <g
                fill="none"
                stroke={seen(2) ? ACCENT : LINE}
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="transition-[stroke] duration-700"
              >
                <path d="M186 120 L186 28 L316 28 M226 120 L226 60 L316 60" />
              </g>
              <g
                fill="none"
                stroke={seen(4) ? ACCENT : LINE}
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="transition-[stroke] duration-700"
              >
                <rect x="316" y="16" width="74" height="56" rx="4" />
                <circle cx="353" cy="44" r="15" />
                <path d="M353 31 L353 57 M340 44 L366 44" strokeWidth="1" />
              </g>

              {/* Hotte */}
              <g
                fill="none"
                stroke={seen(0) ? ACCENT : LINE}
                strokeWidth="1.7"
                strokeLinejoin="round"
                className="transition-[stroke] duration-700"
              >
                <path d="M68 120 L342 120 L316 184 L94 184 Z" />
                <path d="M94 184 L316 184" />
              </g>

              {/* Filtres à chocs */}
              <g
                stroke={seen(1) ? ACCENT : LINE}
                strokeWidth="2.2"
                strokeLinecap="round"
                className="transition-[stroke] duration-700"
                opacity="0.85"
              >
                {Array.from({ length: 11 }).map((_, i) => (
                  <path key={i} d={`M${112 + i * 18} 178 L${122 + i * 18} 144`} />
                ))}
              </g>

              {/* Plan de cuisson */}
              <g stroke="#c3cbd3" strokeWidth="1.3" fill="none">
                <path d="M76 320 L334 320" />
                <path d="M110 320 L110 308 M160 320 L160 308 M250 320 L250 308 M300 320 L300 308" />
              </g>

              {/* Repères techniques */}
              <g fontSize="9.5" fontWeight="600" letterSpacing="1.4">
                <Marker x={62} y={112} label="HOTTE" anchor="start" on={on("hotte")} />
                <Marker x={200} y={140} label="FILTRES" anchor="middle" on={on("filtres")} />
                <Marker x={176} y={24} label="CONDUIT" anchor="end" on={on("conduit")} />
                <Marker x={262} y={94} label="EXTRACTION" anchor="middle" on={on("extraction")} />
                <Marker x={353} y={92} label="MOTEUR" anchor="middle" on={on("moteur")} />
              </g>
            </svg>

            <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Schéma de principe — représentation simplifiée
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marker({
  x,
  y,
  label,
  anchor,
  on,
}: {
  x: number;
  y: number;
  label: string;
  anchor: "start" | "middle" | "end";
  on: boolean;
}) {
  return (
    <g className="transition-opacity duration-500" style={{ opacity: on ? 1 : 0.35 }}>
      {on && <circle cx={x} cy={y + 6} r="16" fill={ACCENT} opacity="0.08" />}
      <circle cx={x} cy={y + 6} r="2.6" fill={on ? ACCENT : LINE} />
      <text
        x={anchor === "end" ? x - 8 : anchor === "start" ? x + 8 : x}
        y={y - 4}
        textAnchor={anchor}
        fill={on ? ACCENT : "#5f6368"}
      >
        {label}
      </text>
    </g>
  );
}
