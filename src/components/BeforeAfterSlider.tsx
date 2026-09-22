import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
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
  const activePointerRef = useRef<number | null>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  // Démo auto du curseur tant que l'utilisateur n'a pas interagi
  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    activePointerRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setTouched(true);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (activePointerRef.current !== e.pointerId) return;
    setFromClientX(e.clientX);
  }

  function endPointer(e: ReactPointerEvent<HTMLDivElement>) {
    if (activePointerRef.current !== e.pointerId) return;
    activePointerRef.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setTouched(true);
      setPos((current) => Math.max(0, current - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setTouched(true);
      setPos((current) => Math.min(100, current + step));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setTouched(true);
      setPos(e.key === "Home" ? 0 : 100);
    }
  }

  return (
    <div
      ref={containerRef}
      data-cursor="Glisser"
      role="slider"
      aria-label={`Comparer avant et après — ${alt}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)} % de la photo avant visible`}
      tabIndex={0}
      className={cn(
        "group relative aspect-[5/4] w-full overflow-hidden rounded-sm bg-muted select-none sm:aspect-[16/10]",
        "touch-pan-y cursor-ew-resize focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onKeyDown={onKeyDown}
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

      <span className="pointer-events-none absolute top-3 left-3 z-[2] rounded-sm border border-ink-foreground/20 bg-ink/90 px-2.5 py-2 text-[11px] font-bold tracking-[0.08em] text-ink-foreground uppercase shadow-card backdrop-blur sm:top-4 sm:left-4 sm:px-3 sm:tracking-[0.14em]">
        Avant <span className="hidden sm:inline">· encrassé</span>
      </span>
      <span className="pointer-events-none absolute top-3 right-3 z-[2] rounded-sm border border-ink/15 bg-background/95 px-2.5 py-2 text-[11px] font-bold tracking-[0.08em] text-foreground uppercase shadow-card backdrop-blur sm:top-4 sm:right-4 sm:px-3 sm:tracking-[0.14em]">
        Après <span className="hidden sm:inline">· propre</span>
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
            "absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink-foreground bg-accent text-accent-foreground shadow-lift sm:h-14 sm:w-14",
            !touched && "handle-hint",
          )}
        >
          <ChevronsLeftRight className="size-6" strokeWidth={2.25} aria-hidden="true" />
        </span>
      </div>

      {!touched && (
        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-[2] flex justify-center sm:inset-x-0 sm:bottom-5">
          <span className="flex items-center gap-2 rounded-sm bg-ink/85 px-3 py-2 text-center text-[11px] font-semibold tracking-[0.06em] text-ink-foreground shadow-card backdrop-blur sm:tracking-[0.12em] sm:uppercase">
            <ChevronsLeftRight className="size-4 shrink-0" aria-hidden="true" />
            Glissez pour comparer
          </span>
        </span>
      )}
    </div>
  );
}
