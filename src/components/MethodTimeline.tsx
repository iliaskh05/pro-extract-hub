import { useEffect, useRef, useState } from "react";
import { METHOD } from "@/lib/method";
import { METHOD_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

/**
 * Frise de méthode — ligne qui se trace à mesure du scroll,
 * étapes qui s'activent séquentiellement. Verticale sur mobile, horizontale desktop.
 */
export function MethodTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);
  const dark = tone === "dark";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReached(METHOD.length);
      return;
    }

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const p = (start - rect.top) / (rect.height + start * 0.25);
      const next = Math.max(0, Math.min(METHOD.length, Math.ceil(p * METHOD.length)));
      setReached((prev) => (next > prev ? next : prev));
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
  }, []);

  const progress = Math.min(100, (reached / METHOD.length) * 100);

  return (
    <div className="relative">
      {/* Rail horizontal (desktop) */}
      <div
        className={cn(
          "absolute top-0 right-0 left-0 hidden h-px lg:block",
          dark ? "bg-ink-border" : "bg-border",
        )}
        aria-hidden="true"
      >
        <span
          className="block h-px bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol
        ref={ref}
        className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14"
      >
        {METHOD.map((step, i) => {
          const Icon = METHOD_ICONS[step.n];
          const active = i < reached;
          return (
            <li
              key={step.n}
              className={cn(
                "relative pt-6 pl-6 transition-all duration-700 lg:pt-8 lg:pl-0",
                active ? "opacity-100" : "opacity-35",
              )}
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              {/* Rail vertical (mobile) */}
              <span
                className={cn(
                  "absolute top-0 left-0 h-full w-px lg:hidden",
                  dark ? "bg-ink-border" : "bg-border",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "absolute top-0 left-0 w-px bg-accent transition-[height] duration-700 lg:hidden",
                  active ? "h-full" : "h-0",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "absolute -top-[3px] left-[-3px] size-1.5 rounded-full transition-colors duration-500 lg:left-0",
                  active ? "bg-accent" : dark ? "bg-ink-border" : "bg-border",
                )}
                aria-hidden="true"
              />

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.22em] text-accent">
                  {step.n}
                </span>
                {Icon && (
                  <Icon
                    className={cn(
                      "size-4 stroke-[1.4] transition-transform duration-500",
                      active && "-translate-y-px",
                      dark ? "text-ink-muted" : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>

              <h3
                className={cn(
                  "mt-4 text-base font-semibold tracking-[-0.02em] sm:text-lg",
                  dark ? "text-ink-foreground" : "text-foreground",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "mt-2 max-w-xs text-sm leading-relaxed",
                  dark ? "text-ink-muted" : "text-muted-foreground",
                )}
              >
                {step.text}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
