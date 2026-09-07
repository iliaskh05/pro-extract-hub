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

const ACCENT = "#1a3a8f";

export function FranceMap({ highlight }: { highlight?: ZoneSlug | undefined }) {
  const reduced = usePrefersReducedMotion();
  const zones = activeZones();
  const dot = (active: boolean) => (active ? ACCENT : "#9aa6c4");

  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-secondary/40 p-4 sm:p-8">
      <svg
        viewBox={MAP.viewBox}
        className="relative mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`Carte de France avec les pôles ${zones.map((z) => z.name).join(", ")}`}
      >
        {MAP.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="#ffffff"
            stroke="#d8dee6"
            strokeWidth="1.1"
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
              <circle cx={x} cy={y} r="20" fill={dot(on)} opacity="0.12">
                {!reduced && on && (
                  <animate
                    attributeName="r"
                    values="14;26;14"
                    dur="3.6s"
                    begin={`${i * 0.7}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={dot(on)}
                stroke="#ffffff"
                strokeWidth="1.4"
                className="transition-[fill] duration-500"
              />
              <text
                x={labelLeft ? x - 11 : x + 11}
                y={y - 3}
                fill="#111111"
                fontSize="12"
                fontWeight="650"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.name}
              </text>
              <text
                x={labelLeft ? x - 11 : x + 11}
                y={y + 11}
                fill="#5f6368"
                fontSize="9.5"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.region}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relative mt-6 grid grid-cols-2 gap-2">
        {zones.map((z) => (
          <Link
            key={z.slug}
            to="/zones/$slug"
            params={{ slug: z.slug }}
            className="rounded-sm border border-border bg-background px-3 py-2 text-center text-xs font-medium transition-colors hover:border-foreground/30"
          >
            {z.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
