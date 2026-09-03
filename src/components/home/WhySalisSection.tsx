import { Camera, ClipboardList, Layers, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CARDS = [
  {
    icon: Layers,
    title: "Expertise technique",
    text: "Compréhension de l'installation : hotte, filtres, conduit et moteur selon accessibilité.",
  },
  {
    icon: Camera,
    title: "Traçabilité",
    text: "Photos et compte rendu des éléments traités, avec signalement des points d'attention.",
  },
  {
    icon: Sparkles,
    title: "Simplicité",
    text: "Demande de devis en ligne, qualification rapide, sans engagement à ce stade.",
  },
  {
    icon: ClipboardList,
    title: "Suivi",
    text: "Historique des interventions et planification d'entretien périodique si pertinent.",
  },
] as const;

export function WhySalisSection() {
  return (
    <section className="bg-background relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.74_0.1_198/0.12),transparent)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">Pourquoi Salis 3 Hottes</p>
          <h2 className="mt-4 text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
            Plus qu'un nettoyage.
            <br />
            Un entretien documenté.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-accent transition-colors group-hover:border-accent/30 group-hover:bg-accent/10">
                  <card.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
