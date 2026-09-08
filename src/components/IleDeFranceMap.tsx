import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CarteIdfIntervention } from "@/components/CarteIdfIntervention";
import { IDF_DEPARTMENTS } from "@/lib/idf-departments";
import { cn } from "@/lib/utils";

/**
 * Zone IDF : carte GeoJSON réelle + liste des départements synchronisée au survol.
 */
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
    <div className={cn("grid gap-6 lg:grid-cols-[1.2fr_0.8fr]", className)}>
      <div className="relative overflow-hidden border border-border bg-white">
        <p className="absolute top-4 left-4 z-10 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Île-de-France · carte réelle
        </p>
        <CarteIdfIntervention
          activeCode={active}
          onActiveChange={setDept}
          className="pt-6"
        />
        <p className="pb-4 text-center text-[11px] text-muted-foreground">
          Survolez un département ou un arrondissement de Paris
        </p>
      </div>

      <div className="flex flex-col border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
            Département actif
          </p>
          <h3 className="font-display mt-1 text-xl font-bold tracking-[-0.03em]">
            {current.name}{" "}
            <span className="text-muted-foreground">({current.code})</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{current.hub}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{current.note}</p>
        </div>

        <ul className="max-h-[22rem] flex-1 divide-y divide-border overflow-y-auto">
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
            to="/zones/$slug"
            params={{ slug: "paris" }}
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
