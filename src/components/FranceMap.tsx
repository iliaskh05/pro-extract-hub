import { Link } from "@tanstack/react-router";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function FranceMap({ highlight }: { highlight?: "paris" | "perpignan" | undefined }) {
  const reduced = usePrefersReducedMotion();
  const dot = (active: boolean) => (active ? "oklch(0.74 0.1 198)" : "oklch(0.74 0.1 198 / 0.55)");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-border surface-ink p-6">
      <div className="grid-tech absolute inset-0" aria-hidden="true" />
      <svg
        viewBox="0 0 300 320"
        className="relative mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label="Carte de France indiquant les pôles de Paris et de Perpignan"
      >
        <path
          d="M148 22 190 34 214 28 236 52 228 84 250 104 244 132 262 156 240 186 246 214 214 232 200 262 168 268 150 292 126 272 96 268 74 244 52 226 44 196 26 168 40 140 34 108 58 86 66 54 96 44 120 26Z"
          fill="oklch(1 0 0 / 0.05)"
          stroke="oklch(0.74 0.1 198 / 0.45)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <g>
          <circle cx="150" cy="104" r="20" fill={dot(highlight !== "perpignan")} opacity="0.16">
            {!reduced && (
              <>
                <animate attributeName="r" values="16;26;16" dur="3.2s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.22;0.04;0.22"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
          <circle
            cx="150"
            cy="104"
            r="5.5"
            fill={dot(highlight !== "perpignan")}
            className="transition-[fill] duration-500"
          />
          <text x="164" y="101" fill="oklch(0.98 0.004 240)" fontSize="11" fontWeight="700">
            Paris
          </text>
          <text x="164" y="114" fill="oklch(0.72 0.012 250)" fontSize="9">
            Île-de-France
          </text>
        </g>
        <g>
          <circle cx="132" cy="266" r="20" fill={dot(highlight !== "paris")} opacity="0.16">
            {!reduced && (
              <>
                <animate
                  attributeName="r"
                  values="16;26;16"
                  dur="3.2s"
                  begin="1.1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.22;0.04;0.22"
                  dur="3.2s"
                  begin="1.1s"
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
          <circle
            cx="132"
            cy="266"
            r="5.5"
            fill={dot(highlight !== "paris")}
            className="transition-[fill] duration-500"
          />
          <text x="146" y="263" fill="oklch(0.98 0.004 240)" fontSize="11" fontWeight="700">
            Perpignan
          </text>
          <text x="146" y="276" fill="oklch(0.72 0.012 250)" fontSize="9">
            Pyrénées-Orientales
          </text>
        </g>
        <path
          d="M150 104 C 118 160, 112 220, 132 266"
          stroke="oklch(0.74 0.1 198 / 0.4)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          fill="none"
        />
      </svg>
      <div className="relative mt-5 grid grid-cols-2 gap-2">
        <Link
          to="/zones/$slug"
          params={{ slug: "paris" }}
          className="rounded-lg border border-ink-border px-3 py-2 text-center text-xs font-medium text-ink-foreground transition-colors hover:bg-ink-foreground/10"
        >
          Paris
        </Link>
        <Link
          to="/zones/$slug"
          params={{ slug: "perpignan" }}
          className="rounded-lg border border-ink-border px-3 py-2 text-center text-xs font-medium text-ink-foreground transition-colors hover:bg-ink-foreground/10"
        >
          Perpignan
        </Link>
      </div>
      <p className="relative mt-3 text-center text-xs text-ink-muted">
        Représentation schématique — zones réellement desservies uniquement.
      </p>
    </div>
  );
}
