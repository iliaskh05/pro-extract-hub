import { useEffect, useRef, type RefObject } from "react";

/**
 * Progression de 0 à 1 pendant qu'un conteneur haut traverse le viewport.
 * Le calcul est fait dans une frame d'animation : aucun re-render React par pixel.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        callback.current(rect.top <= 0 ? 1 : 0);
        return;
      }
      callback.current(Math.min(1, Math.max(0, -rect.top / travel)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}
