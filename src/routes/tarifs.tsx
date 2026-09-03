import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";

const PRICING_FACTORS = [
  {
    title: "Dimension de la hotte",
    text: "Longueur et configuration de la hotte influencent le temps d'intervention.",
  },
  {
    title: "Longueur des conduits",
    text: "Plus le réseau est long, plus les sections accessibles demandent du temps.",
  },
  {
    title: "Moteur et caisson",
    text: "Le traitement du groupe moto-ventilateur dépend de l'accessibilité et de l'état.",
  },
  {
    title: "Filtres",
    text: "Le nombre et le type de filtres orientent la méthode d'entretien.",
  },
  {
    title: "Accessibilité",
    text: "Hauteur, trappes et contraintes du site impactent la préparation.",
  },
  {
    title: "Niveau d'encrassement",
    text: "Un encrassement important peut nécessiter plus de temps et de produits.",
  },
  {
    title: "Type d'établissement",
    text: "L'activité et le rythme de cuisson orientent la fréquence et l'ampleur du travail.",
  },
] as const;

export const Route = createFileRoute("/tarifs")({
  head: () =>
    pageHead({
      title: `Tarifs et devis | ${SITE.name}`,
      description:
        "Aucun prix affiché sans qualification : découvrez les facteurs qui déterminent le coût d'un dégraissage de hotte professionnelle.",
      path: "/tarifs",
      ogTitle: `Comprendre nos tarifs — ${SITE.name}`,
      ogDescription:
        "Chaque installation est unique. Voici les critères qui orientent notre proposition.",
    }),
  component: TarifsPage,
});

function TarifsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title="Chaque installation est unique"
        description="Nous ne publions pas de grille tarifaire générique. Chaque proposition est établie après qualification de votre besoin réel."
        compact
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ce qui détermine le tarif d'une intervention
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Les éléments ci-dessous sont analysés lors de votre demande de devis. Aucun montant
              n'est communiqué sans cette étape de qualification.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING_FACTORS.map((f, i) => (
              <Reveal key={f.title} delay={i * 40}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
            <h3 className="text-xl font-semibold tracking-tight">
              Obtenir une proposition personnalisée
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Décrivez votre installation en quelques minutes. Notre équipe analyse votre demande et
              vous recontacte avec une proposition adaptée.
            </p>
            <Link
              to="/devis"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground"
            >
              Obtenir mon devis
            </Link>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title="Besoin d'un contrat d'entretien ?"
        subtitle="Indiquez la fréquence souhaitée dans le formulaire — nous construisons une proposition sur mesure."
      />
    </>
  );
}
