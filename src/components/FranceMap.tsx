import { Link } from "@tanstack/react-router";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { activeZones, type ZoneSlug } from "@/lib/site";
import franceMap from "@/lib/generated/france-map.json";

type FranceMapData = {
  viewBox: string;
  paths: string[];
  projected: Record<string, [number, number]>;
};

const MAP = franceMap as unknown as FranceMapData;

export function FranceMap({ highlight }: { highlight?: ZoneSlug | undefined }) {
  const reduced = usePrefersReducedMotion();
  const zones = activeZones();
  const dot = (active: boolean) => (active ? "oklch(0.74 0.1 198)" : "oklch(0.74 0.1 198 / 0.55)");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-border surface-ink p-4 sm:p-6">
      <div className="grid-tech absolute inset-0 opacity-25" aria-hidden="true" />
      <svg
        viewBox={MAP.viewBox}
        className="relative mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={`Carte de France avec les pôles ${zones.map((z) => z.name).join(", ")}`}
      >
        <defs>
          <linearGradient id="france-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(1 0 0 / 0.09)" />
            <stop offset="100%" stopColor="oklch(0.74 0.1 198 / 0.12)" />
          </linearGradient>
        </defs>

        {MAP.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#france-fill)"
            stroke="oklch(0.74 0.1 198 / 0.42)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}

        {zones.map((z, i) => {
          const coords = MAP.projected[z.slug];
          if (!coords) return null;
          const [x, y] = coords;
          const on = !highlight || highlight === z.slug;
          const labelLeft = x > 300;

          return (
            <g key={z.slug}>
              <circle cx={x} cy={y} r="22" fill={dot(on)} opacity="0.18">
                {!reduced && on && (
                  <>
                    <animate
                      attributeName="r"
                      values="18;28;18"
                      dur="3.4s"
                      begin={`${i * 0.65}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.24;0.05;0.24"
                      dur="3.4s"
                      begin={`${i * 0.65}s`}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
              <circle
                cx={x}
                cy={y}
                r="5.5"
                fill={dot(on)}
                stroke="oklch(0.98 0.004 240 / 0.85)"
                strokeWidth="1.2"
                className="transition-[fill] duration-500"
              />
              <text
                x={labelLeft ? x - 12 : x + 12}
                y={y - 4}
                fill="oklch(0.98 0.004 240)"
                fontSize="12"
                fontWeight="700"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.name}
              </text>
              <text
                x={labelLeft ? x - 12 : x + 12}
                y={y + 10}
                fill="oklch(0.72 0.012 250)"
                fontSize="9.5"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.region}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relative mt-5 grid grid-cols-2 gap-2">
        {zones.map((z) => (
          <Link
            key={z.slug}
            to="/zones/$slug"
            params={{ slug: z.slug }}
            className="rounded-lg border border-ink-border px-3 py-2 text-center text-xs font-medium text-ink-foreground transition-colors hover:bg-ink-foreground/10"
          >
            {z.name}
          </Link>
        ))}
      </div>
      <p className="relative mt-3 text-center text-xs text-ink-muted">
        Carte métropolitaine — coordonnées GPS des pôles d'intervention.
      </p>
    </div>
  );
}
