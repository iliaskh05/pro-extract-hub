import { Reveal } from "@/components/Reveal";

const FACTS = [
  {
    value: "280°C",
    label: "Auto-inflammation des graisses",
    text: "Au-delà de ce seuil, des dépôts dans un conduit peuvent s'enflammer. Un entretien régulier limite ce risque technique.",
  },
  {
    value: "+35%",
    label: "Surconsommation typique",
    text: "Une extraction encrassée force le moteur à compenser. L'impact énergétique dépend de votre installation.",
  },
  {
    value: "Filtres",
    label: "Premier rempart",
    text: "Des filtres saturés laissent passer graisses et particules vers le conduit — là où l'accès devient plus difficile.",
  },
  {
    value: "Docs",
    label: "Preuve d'intervention",
    text: "Photos et compte rendu vous aident à suivre l'état de l'installation dans le temps, pour vos contrôles internes.",
  },
] as const;

export function RiskFactsStrip() {
  return (
    <section id="preuves" className="border-y border-border bg-secondary/40">
      <div className="shell section-y !py-16 lg:!py-20">
        <Reveal>
          <p className="eyebrow text-accent">Pourquoi entretenir</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            Des repères techniques, pas des promesses marketing
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Ces ordres de grandeur sont des références métier courantes. Chaque cuisine reste un cas
            particulier — le devis part de votre configuration réelle.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 80}>
              <article className="h-full border-l border-accent/40 pl-5">
                <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                  {f.value}
                </p>
                <h3 className="mt-2 text-sm font-semibold tracking-tight">{f.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
