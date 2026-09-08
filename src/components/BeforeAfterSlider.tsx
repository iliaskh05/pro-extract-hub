import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BeforeAfterTreatment = "grime" | "clean";

type Props = {
  before: string;
  after: string;
  alt: string;
  className?: string;
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
      filter: "contrast(1.2) saturate(1.55) brightness(0.72) sepia(0.42) hue-rotate(-8deg)",
    };
  }
  return base;
}

export function BeforeAfterSlider({
  before,
  after,
  alt,
  className,
  objectPosition = "center center",
  beforeTreatment = "clean",
  afterTreatment = "clean",
}: Props) {
  const [pos, setPos] = useState(58);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, setFromClientX]);

  // Démo auto du curseur tant que l'utilisateur n'a pas interagi
  useEffect(() => {
    if (touched) return;
    let dir = -1;
    const id = window.setInterval(() => {
      setPos((p) => {
        const next = p + dir * 0.55;
        if (next <= 28) {
          dir = 1;
          return 28;
        }
        if (next >= 72) {
          dir = -1;
          return 72;
        }
        return next;
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [touched]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
    setTouched(true);
    setFromClientX(e.clientX);
  }

  const sliderId = `ba-${alt.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      ref={containerRef}
      data-cursor="Glisser"
      role="group"
      aria-label={`Comparer avant et après — ${alt}`}
      className={cn(
        "group relative aspect-[4/3] w-full touch-none overflow-hidden rounded-sm bg-muted select-none sm:aspect-[16/10]",
        "cursor-ew-resize",
        className,
      )}
      onPointerDown={onPointerDown}
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
        className="absolute inset-0 overflow-hidden will-change-[clip-path]"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          transition: dragging ? "none" : "clip-path 40ms linear",
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
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-80"
            style={{
              backgroundImage:
                "radial-gradient(circle at 28% 32%, oklch(0.28 0.1 55 / 0.9), transparent 52%), radial-gradient(circle at 72% 58%, oklch(0.22 0.08 45 / 0.85), transparent 48%), linear-gradient(165deg, oklch(0.2 0.06 50 / 0.65), transparent 45%), linear-gradient(0deg, oklch(0.3 0.09 70 / 0.35), transparent 55%)",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      <span className="pointer-events-none absolute top-4 left-4 z-[2] rounded-sm bg-ink/85 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase backdrop-blur">
        Avant · sale
      </span>
      <span className="pointer-events-none absolute top-4 right-4 z-[2] rounded-sm bg-white/95 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase backdrop-blur">
        Après · propre
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-[3] w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.2)]"
        style={{
          left: `${pos}%`,
          transition: dragging ? "none" : "left 40ms linear",
        }}
      >
        <span
          className={cn(
            "absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-accent text-accent-foreground shadow-lift",
            !touched && "handle-hint",
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="2"
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
        className="sr-only"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-label={`Comparer avant et après — ${alt}`}
      />

      {!touched && (
        <span className="pointer-events-none absolute inset-x-0 bottom-5 z-[2] flex justify-center">
          <span className="rounded-sm bg-ink/70 px-3 py-1.5 text-[10px] tracking-[0.2em] text-ink-foreground uppercase backdrop-blur">
            Glissez le curseur pour comparer
          </span>
        </span>
      )}
    </div>
  );
}
