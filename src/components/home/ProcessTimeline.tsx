import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: "01", t: "Votre demande", d: "Vous décrivez votre installation en quelques minutes." },
  { n: "02", t: "Analyse de l'installation", d: "Nous qualifions la configuration et les accès." },
  { n: "03", t: "Proposition", d: "Vous recevez une proposition adaptée à votre cuisine." },
  { n: "04", t: "Planification", d: "Le créneau est arrêté avec vous, selon votre service." },
  { n: "05", t: "Intervention", d: "Les éléments concernés sont traités et contrôlés." },
  { n: "06", t: "Suivi", d: "Rapport, points d'attention et prochaine échéance." },
];

export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      if (railRef.current) railRef.current.style.transform = `scaleY(${progress})`;
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

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { threshold: [0.4, 0.75], rootMargin: "-25% 0px -35% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal>
          <p className="eyebrow text-accent">Parcours</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
            Six étapes, aucune zone d'ombre
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:gap-20">
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <p
                key={STEPS[active]!.n}
                className="step-in font-mono text-[8.5rem] leading-none font-semibold tracking-tight text-foreground/10"
              >
                {STEPS[active]!.n}
              </p>
              <p className="mt-4 max-w-xs text-lg font-medium tracking-tight">{STEPS[active]!.t}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {STEPS[active]!.d}
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute top-0 left-0 h-full w-px bg-border" aria-hidden="true" />
            <span
              ref={railRef}
              className="absolute top-0 left-0 h-full w-px origin-top scale-y-0 bg-accent"
              aria-hidden="true"
            />
            <ol ref={listRef}>
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="relative py-8 pl-8 lg:py-12"
                >
                  <span
                    className={cn(
                      "absolute top-10 -left-[4px] size-2 rounded-full transition-all duration-500 lg:top-14",
                      i === active ? "scale-150 bg-accent" : "bg-border",
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{s.n}</span>
                  <p
                    className={cn(
                      "mt-2 text-xl font-semibold tracking-tight transition-colors duration-500 lg:text-2xl",
                      i === active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.t}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground lg:hidden">
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
