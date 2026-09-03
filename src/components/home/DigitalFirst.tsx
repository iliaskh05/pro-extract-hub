import { useEffect, useRef, useState } from "react";
import { ClipboardList, FileText, Globe, History, LayoutDashboard, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const FLOW = [
  { icon: Globe, label: "Site" },
  { icon: ClipboardList, label: "Demande" },
  { icon: LayoutDashboard, label: "CRM" },
  { icon: Wrench, label: "Intervention" },
  { icon: FileText, label: "Rapport" },
  { icon: History, label: "Suivi" },
];

export function DigitalFirst() {
  const flowRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = flowRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="surface-ink relative overflow-hidden" data-header-tone="dark">
      <div className="grid-tech absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-accent">Digital first</p>
              <h2 className="mt-4 max-w-lg text-3xl leading-[1.04] font-semibold tracking-[-0.04em] text-ink-foreground sm:text-5xl">
                Une entreprise de terrain.
                <span className="mt-1 block text-ink-muted">Une expérience digitale moderne.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted md:text-base">
                Chaque demande entre dans une chaîne continue : elle est qualifiée, planifiée,
                documentée, puis suivie dans le temps. Le site n'est que la porte d'entrée.
              </p>
            </Reveal>

            <div ref={flowRef} className="mt-12">
              <div className="relative">
                <span
                  className="absolute top-6 right-0 left-0 hidden h-px bg-ink-border sm:block"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-6 left-0 hidden h-px origin-left bg-accent transition-transform duration-[1600ms] ease-out sm:block"
                  style={{ right: 0, transform: `scaleX(${inView ? 1 : 0})` }}
                  aria-hidden="true"
                />
                <ol className="relative grid grid-cols-3 gap-4 sm:grid-cols-6">
                  {FLOW.map((node, i) => (
                    <li key={node.label} className="flex flex-col items-center text-center">
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full border bg-ink transition-all duration-500 ease-out",
                          inView
                            ? "border-accent/60 text-accent opacity-100"
                            : "translate-y-2 border-ink-border text-ink-muted opacity-0",
                        )}
                        style={{ transitionDelay: `${i * 180}ms` }}
                      >
                        <node.icon className="size-5" />
                      </span>
                      <span
                        className="mt-3 text-[11px] tracking-[0.12em] text-ink-muted uppercase transition-opacity duration-500"
                        style={{
                          transitionDelay: `${i * 180 + 120}ms`,
                          opacity: inView ? 1 : 0,
                        }}
                      >
                        {node.label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="mt-8 text-xs leading-relaxed text-ink-muted">
                WhatsApp, email, assistant et rappels viendront s'y greffer progressivement.
              </p>
            </div>
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-xs">
              <div
                className="pointer-events-none absolute -inset-10 rounded-full bg-accent/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-[2.25rem] border border-ink-border bg-ink-soft p-2.5 shadow-lift">
                <div className="overflow-hidden rounded-[1.85rem] bg-ink">
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <span className="text-[10px] tracking-[0.2em] text-ink-muted uppercase">
                      Salis 3 Hottes
                    </span>
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  </div>

                  <div className="px-5">
                    <div className="rounded-xl border border-accent/25 bg-accent/10 p-3">
                      <p className="text-[10px] tracking-[0.16em] text-accent uppercase">
                        Nouvelle demande
                      </p>
                      <p className="mt-1 text-xs text-ink-foreground">
                        Reçue depuis le site · en attente de qualification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 px-4 py-4">
                    {[
                      { k: "Établissement", v: "Restaurant" },
                      { k: "Zone", v: "Troyes · Dijon" },
                      { k: "Statut", v: "Nouveau" },
                      { k: "Rapport", v: "Photos + compte rendu" },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="flex items-center justify-between rounded-xl border border-ink-border bg-ink-foreground/5 px-3.5 py-2.5"
                      >
                        <span className="text-[11px] text-ink-muted">{row.k}</span>
                        <span className="text-[11px] font-medium text-ink-foreground">{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-ink-border px-5 py-4">
                    <div className="flex h-10 items-center justify-center rounded-lg bg-ink-foreground text-xs font-semibold text-ink">
                      Obtenir mon devis
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-[10px] tracking-[0.2em] text-ink-muted uppercase">
                Maquette — parcours client
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
