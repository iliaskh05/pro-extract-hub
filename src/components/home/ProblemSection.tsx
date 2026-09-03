import { Reveal } from "@/components/Reveal";
import { MEDIA } from "@/lib/media";

const PARTS = [
  {
    n: "01",
    title: "La hotte",
    text: "Surfaces intérieures, plénum et bacs de récupération : le premier point où la graisse se dépose.",
  },
  {
    n: "02",
    title: "Les filtres",
    text: "Saturés, ils cessent de retenir. Ce qu'ils ne captent plus part directement dans le conduit.",
  },
  {
    n: "03",
    title: "Le conduit",
    text: "Les dépôts s'installent là où personne ne regarde, sur des sections parfois difficiles d'accès.",
  },
  {
    n: "04",
    title: "Le moteur et le caisson",
    text: "Un groupe encrassé travaille davantage pour extraire moins, quand la configuration permet d'y accéder.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal variant="mask">
                <figure className="relative overflow-hidden rounded-2xl">
                  <img
                    src={MEDIA.beforeHood}
                    alt="Filtres de hotte professionnelle fortement encrassés — démonstration"
                    loading="lazy"
                    width={1200}
                    height={1500}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <figcaption className="absolute top-4 left-4 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase backdrop-blur">
                    Démonstration
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  Un système d'extraction ne prévient pas. Il se dégrade lentement, puis coûte d'un
                  coup.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-6">
            <Reveal>
              <p className="eyebrow text-accent">Le problème</p>
              <h2 className="mt-4 max-w-xl text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
                Votre extraction travaille chaque jour.
                <span className="mt-2 block text-muted-foreground">
                  Elle mérite plus qu'un simple nettoyage.
                </span>
              </h2>
            </Reveal>

            <ol className="mt-14 lg:mt-20">
              {PARTS.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 60}>
                  <div className="grid gap-2 border-t border-border py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 lg:py-12">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-accent sm:pt-2">
                      {p.n}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {p.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
