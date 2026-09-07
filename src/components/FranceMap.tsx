import { useEffect, useRef, useState } from "react";
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
const IDLE = "#7d93bd";

/** Carte de couverture : silhouette nette, marqueurs animés séquentiellement. */
export function FranceMap({ highlight }: { highlight?: ZoneSlug | undefined }) {
  const reduced = usePrefersReducedMotion();
  const zones = activeZones();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const activeSlug = hovered ?? highlight ?? null;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-sm border border-border bg-white p-4 sm:p-8"
    >
      <div className="grid-blue pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <svg
        viewBox={MAP.viewBox}
        className="relative mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={`Carte de France des zones d'intervention : ${zones.map((z) => z.name).join(", ")}`}
      >
        <defs>
          <linearGradient id="fr-fill" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#f1f8fb" />
            <stop offset="100%" stopColor="#dceff6" />
          </linearGradient>
        </defs>

        {MAP.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#fr-fill)"
            stroke="#b9ddeb"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        ))}

        {zones.map((z, i) => {
          const coords = MAP.projected[z.slug];
          if (!coords) return null;
          const [x, y] = coords;
          const on = !activeSlug || activeSlug === z.slug;
          const strong = activeSlug === z.slug;
          const color = on ? ACCENT : IDLE;
          const labelLeft = x > 300;

          return (
            <g
              key={z.slug}
              className={shown && !reduced ? "marker-pop" : undefined}
              style={{ animationDelay: `${i * 0.18}s`, opacity: shown || reduced ? 1 : 0 }}
              onMouseEnter={() => setHovered(z.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={x} cy={y} r={strong ? 26 : 20} fill={color} opacity="0.14">
                {!reduced && on && (
                  <animate
                    attributeName="r"
                    values="15;27;15"
                    dur="3.6s"
                    begin={`${i * 0.7}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle cx={x} cy={y} r="9" fill="#ffffff" opacity="0.9" />
              <circle
                cx={x}
                cy={y}
                r={strong ? 6 : 5}
                fill={color}
                stroke="#ffffff"
                strokeWidth="1.8"
                className="transition-all duration-500"
              />
              <text
                x={labelLeft ? x - 13 : x + 13}
                y={y - 2}
                fill="#0b2433"
                fontSize="13"
                fontWeight="700"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.name}
              </text>
              <text
                x={labelLeft ? x - 13 : x + 13}
                y={y + 12}
                fill={on ? ACCENT : "#5f6770"}
                fontSize="10"
                fontWeight="500"
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
            onMouseEnter={() => setHovered(z.slug)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(z.slug)}
            onBlur={() => setHovered(null)}
            className="rounded-sm border border-border bg-background px-3 py-2 text-center text-xs font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {z.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
