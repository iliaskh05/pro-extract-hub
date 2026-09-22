import { cn } from "@/lib/utils";
import idfMap from "@/lib/generated/idf-map.json";

type IdfRegion = {
  code: string;
  kind: string;
  label: string;
  d: string;
};

type IdfMapData = {
  viewBox: string;
  regions: IdfRegion[];
};

const MAP = idfMap as IdfMapData;

const FILL = {
  idle: "#e8eef5",
  active: "#1a3a8f",
  stroke: "#ffffff",
  strokeActive: "#0f2460",
} as const;

type Props = {
  className?: string;
  activeCode?: string | null;
  onActiveChange?: (code: string | null) => void;
};

/** Carte IDF interactive (SVG pré-généré, 8 départements). */
export function CarteIdfIntervention({ className, activeCode = "75", onActiveChange }: Props) {
  function activate(code: string) {
    onActiveChange?.(code);
  }

  return (
    <div className={cn("relative w-full overflow-hidden bg-white", className)}>
      <svg
        viewBox={MAP.viewBox}
        className="mx-auto h-auto w-full max-w-2xl max-h-[42svh] sm:max-h-none"
        role="img"
        aria-label="Carte interactive des départements d'Île-de-France"
      >
        {MAP.regions.map((region) => {
          const on = activeCode === region.code;
          return (
            <path
              key={region.code}
              d={region.d}
              fill={on ? FILL.active : FILL.idle}
              stroke={on ? FILL.strokeActive : FILL.stroke}
              strokeWidth={on ? 1.2 : 0.7}
              strokeLinejoin="round"
              className="cursor-pointer transition-[fill,stroke] duration-200"
              onMouseEnter={() => activate(region.code)}
              onClick={() => activate(region.code)}
            >
              <title>{region.label}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}

export default CarteIdfIntervention;
