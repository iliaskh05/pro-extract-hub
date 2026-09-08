import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { IDF_DEPARTMENTS } from "@/lib/idf-departments";
import { cn } from "@/lib/utils";

/**
 * Schéma interactif Île-de-France — survol curseur = département actif.
 * Représentation schématique (pas une carte cadastrale).
 */
const SHAPES: Record<string, string> = {
  // ViewBox 0 0 400 360 — Paris centre, départements autour
  "75": "M168 148 L232 148 L232 208 L168 208 Z",
  "92": "M118 148 L168 148 L168 208 L118 220 L100 180 Z",
  "93": "M232 130 L290 120 L300 180 L232 198 Z",
  "94": "M232 198 L300 210 L280 270 L200 260 L168 208 L232 208 Z",
  "95": "M140 70 L250 60 L290 120 L232 130 L168 148 L130 130 Z",
  "78": "M60 140 L118 148 L100 180 L118 220 L90 280 L40 240 L45 170 Z",
  "91": "M118 220 L168 208 L200 260 L180 320 L90 300 L90 280 Z",
  "77": "M290 120 L360 110 L370 220 L300 280 L280 270 L300 210 L300 180 Z",
};

const LABEL_POS: Record<string, { x: number; y: number }> = {
  "75": { x: 200, y: 182 },
  "92": { x: 128, y: 178 },
  "93": { x: 268, y: 155 },
  "94": { x: 245, y: 235 },
  "95": { x: 200, y: 105 },
  "78": { x: 78, y: 200 },
  "91": { x: 145, y: 265 },
  "77": { x: 330, y: 185 },
};

export function IleDeFranceMap({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (code: string | null) => void;
}) {
  const [active, setActive] = useState<string | null>("75");

  function setDept(code: string | null) {
    setActive(code);
    onSelect?.(code);
  }

  const current = IDF_DEPARTMENTS.find((d) => d.code === active) ?? IDF_DEPARTMENTS[0]!;

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1.15fr_0.85fr]", className)}>
      <div className="relative overflow-hidden rounded-sm border border-border bg-white p-4 sm:p-6">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Île-de-France · survol interactif
        </p>
        <svg
          viewBox="0 0 400 360"
          className="mx-auto h-auto w-full max-w-md"
          role="img"
          aria-label="Schéma interactif des départements d'Île-de-France"
        >
          <defs>
            <filter id="idf-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a3a8f" floodOpacity="0.25" />
            </filter>
          </defs>

          {IDF_DEPARTMENTS.map((d) => {
            const path = SHAPES[d.code];
            if (!path) return null;
            const on = active === d.code;
            return (
              <g
                key={d.code}
                className="cursor-pointer"
                onMouseEnter={() => setDept(d.code)}
                onFocus={() => setDept(d.code)}
                tabIndex={0}
                role="button"
                aria-label={`${d.name} (${d.code})`}
                aria-pressed={on}
              >
                <path
                  d={path}
                  fill={on ? "#1a3a8f" : "#e8eef5"}
                  stroke={on ? "#0f2460" : "#b9c7dc"}
                  strokeWidth={on ? 2.2 : 1.4}
                  strokeLinejoin="round"
                  className="transition-[fill,stroke] duration-300 ease-out"
                  filter={on ? "url(#idf-glow)" : undefined}
                />
                <text
                  x={LABEL_POS[d.code]?.x ?? 0}
                  y={LABEL_POS[d.code]?.y ?? 0}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={on ? "#ffffff" : "#0b2433"}
                  fontSize={d.code === "75" ? 13 : 11}
                  fontWeight={700}
                  className="pointer-events-none select-none"
                >
                  {d.code === "75" ? "PARIS" : d.code}
                </text>
                {d.code === "75" && (
                  <text
                    x={200}
                    y={198}
                    textAnchor="middle"
                    fill={on ? "#dce7ff" : "#5f6770"}
                    fontSize="9"
                    fontWeight={500}
                    className="pointer-events-none select-none"
                  >
                    20 arr.
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Déplacez le curseur sur un département
        </p>
      </div>

      <div className="flex flex-col rounded-sm border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
            Département actif
          </p>
          <h3 className="font-display mt-1 text-xl font-semibold tracking-[-0.03em]">
            {current.name}{" "}
            <span className="text-muted-foreground">({current.code})</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{current.hub}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{current.note}</p>
        </div>

        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {IDF_DEPARTMENTS.map((d) => (
            <li key={d.code}>
              <button
                type="button"
                onMouseEnter={() => setDept(d.code)}
                onFocus={() => setDept(d.code)}
                onClick={() => setDept(d.code)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors",
                  active === d.code ? "bg-accent/8" : "hover:bg-secondary/70",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold tracking-tight">
                    {d.name}{" "}
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      ({d.code})
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {d.hub}
                  </span>
                </span>
                {active === d.code && (
                  <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-border p-4">
          <Link
            to="/zones/paris"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            Page zone Paris / IDF
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
