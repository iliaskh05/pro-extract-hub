import { useEffect, useRef, useState } from "react";

/**
 * Curseur contextuel : n'apparaît que sur les éléments portant `data-cursor`.
 * Desktop à pointeur fin uniquement, désactivé si `prefers-reduced-motion`.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const node = ref.current;
      if (node) node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);

      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      setLabel(target ? (target.getAttribute("data-cursor") ?? null) : null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden lg:block"
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full border border-ink-foreground/25 bg-ink/70 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase backdrop-blur-md transition-[opacity,transform] duration-300 ease-out"
        style={{
          opacity: label ? 1 : 0,
          transform: label ? "scale(1)" : "scale(0.6)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
