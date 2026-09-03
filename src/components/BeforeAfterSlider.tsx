import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BeforeAfterTreatment = "grime" | "clean";

type Props = {
  before: string;
  after: string;
  alt: string;
  className?: string;
  demo?: boolean;
  /** Même cadrage pour avant/après (obligatoire pour un slider crédible). */
  objectPosition?: string;
  /** Traitement visuel quand avant et après partagent la même prise de vue. */
  beforeTreatment?: BeforeAfterTreatment;
  afterTreatment?: BeforeAfterTreatment;
};

function imageStyle(objectPosition: string, treatment: BeforeAfterTreatment): CSSProperties {
  const base: CSSProperties = { objectPosition };
  if (treatment === "grime") {
    return {
      ...base,
      filter: "contrast(1.12) saturate(1.35) brightness(0.82) sepia(0.28)",
    };
  }
  return base;
}

export function BeforeAfterSlider({
  before,
  after,
  alt,
  className,
  demo = false,
  objectPosition = "center center",
  beforeTreatment = "clean",
  afterTreatment = "clean",
}: Props) {
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const sliderId = `ba-${alt.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      ref={containerRef}
      data-cursor="Glisser"
      className={cn(
        "group cursor-swap relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl bg-muted select-none sm:aspect-[16/10]",
        className,
      )}
      onPointerDown={(e) => {
        setDragging(true);
        setTouched(true);
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging) setFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        setDragging(false);
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      }}
      onPointerCancel={() => setDragging(false)}
    >
      <img
        src={after}
        alt={`${alt} — après`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={imageStyle(objectPosition, afterTreatment)}
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          transition: dragging ? "none" : "clip-path 450ms var(--ease-premium)",
        }}
      >
        <img
          src={before}
          alt={`${alt} — avant`}
          loading="lazy"
          className="h-full w-full object-cover"
          style={imageStyle(objectPosition, beforeTreatment)}
          draggable={false}
        />
        {beforeTreatment === "grime" && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 35%, oklch(0.35 0.08 65 / 0.85), transparent 55%), radial-gradient(circle at 70% 60%, oklch(0.28 0.06 55 / 0.75), transparent 50%), linear-gradient(180deg, oklch(0.25 0.05 50 / 0.5), transparent 40%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase backdrop-blur">
        Avant
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-ink-foreground/90 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase backdrop-blur">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-ink-foreground/90"
        style={{
          left: `${pos}%`,
          transition: dragging ? "none" : "left 450ms var(--ease-premium)",
        }}
      >
        <span
          className={cn(
            "absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink-foreground/40 bg-background/95 shadow-lift transition-shadow duration-300 group-hover:shadow-glow",
            !touched && "handle-hint",
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <label className="sr-only" htmlFor={sliderId}>
        Comparer avant / après — {alt}
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          setTouched(true);
          setPos(Number(e.target.value));
        }}
        className="absolute inset-x-0 bottom-0 h-12 w-full cursor-ew-resize opacity-0 focus-visible:opacity-100 focus-visible:outline-none"
        aria-label={`Comparer avant et après — ${alt}`}
      />

      {!touched && (
        <span className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center text-[10px] tracking-[0.24em] text-ink-foreground/70 uppercase sm:flex">
          Glissez pour comparer
        </span>
      )}
    </div>
  );
}
