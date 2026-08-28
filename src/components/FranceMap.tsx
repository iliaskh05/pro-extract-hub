import { Link } from "@tanstack/react-router";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { activeZones, type ZoneSlug } from "@/lib/site";

export function FranceMap({ highlight }: { highlight?: ZoneSlug | undefined }) {
  const reduced = usePrefersReducedMotion();
  const zones = activeZones();
  const dot = (active: boolean) => (active ? "oklch(0.74 0.1 198)" : "oklch(0.74 0.1 198 / 0.55)");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-border surface-ink p-6">
      <div className="grid-tech absolute inset-0" aria-hidden="true" />
      <svg
        viewBox="0 0 300 320"
        className="relative mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`Carte de France indiquant les pôles de ${zones.map((z) => z.name).join(", ")}`}
      >
        <path
          d="M148 22 190 34 214 28 236 52 228 84 250 104 244 132 262 156 240 186 246 214 214 232 200 262 168 268 150 292 126 272 96 268 74 244 52 226 44 196 26 168 40 140 34 108 58 86 66 54 96 44 120 26Z"
          fill="oklch(1 0 0 / 0.05)"
          stroke="oklch(0.74 0.1 198 / 0.45)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {zones.map((z, i) => {
          const on = !highlight || highlight === z.slug;
          const labelLeft = z.map.x > 200;
          return (
            <g key={z.slug}>
              <circle cx={z.map.x} cy={z.map.y} r="20" fill={dot(on)} opacity="0.16">
                {!reduced && (
                  <>
                    <animate
                      attributeName="r"
                      values="16;26;16"
                      dur="3.2s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.22;0.04;0.22"
                      dur="3.2s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
              <circle
                cx={z.map.x}
                cy={z.map.y}
                r="5.5"
                fill={dot(on)}
                className="transition-[fill] duration-500"
              />
              <text
                x={labelLeft ? z.map.x - 14 : z.map.x + 14}
                y={z.map.y - 3}
                fill="oklch(0.98 0.004 240)"
                fontSize="11"
                fontWeight="700"
                textAnchor={labelLeft ? "end" : "start"}
              >
                {z.name}
              </text>
              <text
                x={labelLeft ? z.map.x - 14 : z.map.x + 14}
                y={z.map.y + 10}
                fill="oklch(0.72 0.012 250)"
                fontSize="9"
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
        Représentation schématique — zones réellement desservies uniquement.
      </p>
    </div>
  );
}
