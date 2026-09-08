import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, type GeographyType } from "react-simple-maps";
import { IDF_DEPARTMENT_CODES } from "@/lib/idf-departments";
import { cn } from "@/lib/utils";

const GEOJSON_DEPARTEMENTS =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson";
/** 20 arrondissements municipaux — Open Data Paris. */
const GEOJSON_ARRONDISSEMENTS_PARIS =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/arrondissements/exports/geojson";

/** Couronne hors Paris (75 = arrondissements séparés). */
const IDF_OUTER = IDF_DEPARTMENT_CODES.filter((c) => c !== "75");

type FeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: string;
    properties: Record<string, string | number | undefined>;
    geometry: unknown;
  }>;
};

const FILL = {
  idle: "#e8eef5",
  idleParis: "#dce5f2",
  active: "#1a3a8f",
  stroke: "#ffffff",
  strokeActive: "#0f2460",
} as const;

type Props = {
  className?: string;
  /** Code département actif (ex. "75", "92"). */
  activeCode?: string | null;
  onActiveChange?: (code: string | null) => void;
};

/**
 * Carte GeoJSON réelle Île-de-France — départements + 20 arrondissements de Paris.
 */
export function CarteIdfIntervention({
  className,
  activeCode = "75",
  onActiveChange,
}: Props) {
  const [idfGeo, setIdfGeo] = useState<FeatureCollection | null>(null);
  const [parisGeo, setParisGeo] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(GEOJSON_DEPARTEMENTS).then((r) => {
        if (!r.ok) throw new Error("deps");
        return r.json() as Promise<FeatureCollection>;
      }),
      fetch(GEOJSON_ARRONDISSEMENTS_PARIS).then((r) => {
        if (!r.ok) throw new Error("paris");
        return r.json() as Promise<FeatureCollection>;
      }),
    ])
      .then(([deps, paris]) => {
        if (cancelled) return;
        setIdfGeo({
          ...deps,
          features: deps.features.filter((f) => {
            const code = String(f.properties.code ?? "");
            return IDF_OUTER.includes(code);
          }),
        });
        setParisGeo(paris);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function activate(code: string) {
    onActiveChange?.(code);
  }

  function deptStyle(code: string) {
    const on = activeCode === code;
    return {
      default: {
        fill: on ? FILL.active : FILL.idle,
        outline: "none",
        stroke: on ? FILL.strokeActive : FILL.stroke,
        strokeWidth: on ? 1.2 : 0.7,
        transition: "fill 200ms ease, stroke 200ms ease",
      },
      hover: {
        fill: FILL.active,
        outline: "none",
        stroke: FILL.strokeActive,
        strokeWidth: 1.2,
        cursor: "pointer",
      },
      pressed: {
        fill: "#0f2460",
        outline: "none",
      },
    };
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex min-h-[16rem] items-center justify-center bg-secondary/40 px-6 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        Impossible de charger la carte. Vérifiez votre connexion.
      </div>
    );
  }

  if (!idfGeo || !parisGeo) {
    return (
      <div
        className={cn(
          "flex min-h-[16rem] items-center justify-center bg-secondary/30 text-sm text-muted-foreground",
          className,
        )}
      >
        Chargement de la carte…
      </div>
    );
  }

  const parisOn = activeCode === "75";

  return (
    <div className={cn("relative w-full overflow-hidden bg-white", className)}>
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-2.45, -48.72, 0],
          scale: 38000,
        }}
        width={800}
        height={640}
        className="mx-auto h-auto w-full max-w-2xl"
        role="img"
        aria-label="Carte interactive des départements d'Île-de-France"
      >
        <Geographies geography={idfGeo}>
          {({ geographies }) =>
            geographies.map((geo: GeographyType) => {
              const code = String(geo.properties.code ?? "");
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => activate(code)}
                  onClick={() => activate(code)}
                  style={deptStyle(code)}
                />
              );
            })
          }
        </Geographies>

        <Geographies geography={parisGeo}>
          {({ geographies }) =>
            geographies.map((geo: GeographyType) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => activate("75")}
                onClick={() => activate("75")}
                style={{
                  default: {
                    fill: parisOn ? FILL.active : FILL.idleParis,
                    outline: "none",
                    stroke: FILL.stroke,
                    strokeWidth: 0.45,
                    transition: "fill 200ms ease",
                  },
                  hover: {
                    fill: FILL.active,
                    outline: "none",
                    stroke: FILL.stroke,
                    strokeWidth: 0.7,
                    cursor: "pointer",
                  },
                  pressed: { fill: "#0f2460", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default CarteIdfIntervention;
