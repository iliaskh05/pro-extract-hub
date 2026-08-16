import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  before: string;
  after: string;
  alt: string;
  className?: string;
};

export function BeforeAfterSlider({ before, after, alt, className }: Props) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[4/3] w-full touch-none overflow-hidden rounded-xl bg-muted select-none sm:aspect-[16/10]",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      <img
        src={after}
        alt={`${alt} — après`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={`${alt} — avant`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-semibold tracking-widest text-ink-foreground uppercase backdrop-blur">
        Avant
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold tracking-widest text-accent-foreground uppercase backdrop-blur">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-ink-foreground/90"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink-foreground/70 bg-background/95 shadow-lift">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <label className="sr-only" htmlFor={`ba-${alt}`}>
        Comparer avant / après — {alt}
      </label>
      <input
        id={`ba-${alt}`}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
        aria-label={`Comparer avant et après — ${alt}`}
      />
    </div>
  );
}
