import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CarteIdfIntervention } from "@/components/CarteIdfIntervention";
import { IDF_DEPARTMENTS } from "@/lib/idf-departments";
import { cn } from "@/lib/utils";

/**
 * Zone IDF : liste tactile d'abord sur mobile, carte en illustration.
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
    <div className={cn("grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]", className)}>
      {/* Liste en premier sur mobile */}
      <div className="order-1 flex flex-col border border-border bg-background lg:order-2">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
            Département actif
          </p>
          <h3 className="font-display mt-1 text-lg font-bold tracking-[-0.03em] sm:text-xl">
            {current.name}{" "}
            <span className="text-muted-foreground">({current.code})</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{current.hub}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:mt-3">
            {current.note}
          </p>
        </div>

        <ul className="grid grid-cols-2 divide-x divide-y divide-border sm:max-h-[22rem] sm:grid-cols-1 sm:overflow-y-auto lg:flex-1">
          {IDF_DEPARTMENTS.map((d) => (
            <li key={d.code} className="min-w-0">
              <button
                type="button"
                onMouseEnter={() => setDept(d.code)}
                onFocus={() => setDept(d.code)}
                onClick={() => setDept(d.code)}
                className={cn(
                  "flex min-h-12 w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors sm:gap-3 sm:px-5",
                  active === d.code ? "bg-accent/8" : "active:bg-secondary/70 hover:bg-secondary/70",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold tracking-tight">
                    {d.name}{" "}
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      ({d.code})
                    </span>
                  </span>
                  <span className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
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
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent"
          >
            Page zone Paris / IDF
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="relative order-2 overflow-hidden border border-border bg-white lg:order-1">
        <p className="absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:top-4 sm:left-4">
          Île-de-France
        </p>
        <CarteIdfIntervention
          activeCode={active}
          onActiveChange={setDept}
          className="pt-5 sm:pt-6"
        />
        <p className="px-3 pb-3 text-center text-xs text-muted-foreground sm:pb-4">
          Touchez un département sur la carte ou dans la liste
        </p>
      </div>
    </div>
  );
}
