import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const METHOD = [
  {
    n: "01",
    title: "Analyse",
    text: "Relevé de la configuration : hotte, filtres, conduit, moteur, accès et contraintes du site.",
  },
  {
    n: "02",
    title: "Préparation",
    text: "Protection des équipements et du poste de cuisson, consignation électrique lorsque nécessaire.",
  },
  {
    n: "03",
    title: "Dégraissage",
    text: "Traitement des éléments concernés avec des produits et méthodes adaptés aux supports.",
  },
  {
    n: "04",
    title: "Contrôle",
    text: "Vérification visuelle des zones traitées et remise en configuration de l'installation.",
  },
  {
    n: "05",
    title: "Documentation",
    text: "Photos avant / après et compte rendu des éléments traités et des points d'attention.",
  },
  {
    n: "06",
    title: "Suivi",
    text: "Proposition de la prochaine échéance et conservation de l'historique de votre installation.",
  },
];

export const Route = createFileRoute("/methode")({
  head: () => ({
    meta: [
      { title: "Notre méthode d'intervention en 6 étapes | Extraction Pro" },
      {
        name: "description",
        content:
          "Analyse, préparation, dégraissage, contrôle, documentation et suivi : la méthode d'intervention appliquée à chaque système d'extraction.",
      },
      { property: "og:title", content: "Notre méthode — Extraction Pro" },
      {
        property: "og:description",
        content: "Six étapes documentées, de l'analyse au suivi de votre installation.",
      },
      { property: "og:url", content: "/methode" },
    ],
    links: [{ rel: "canonical", href: "/methode" }],
  }),
  component: MethodPage,
});

function MethodPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-24">
      <p className="eyebrow text-accent">Notre méthode</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
        Une intervention structurée, documentée de bout en bout
      </h1>

      <ol className="relative mt-14 border-l border-border pl-8 md:pl-12">
        {METHOD.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 70} className="relative pb-12 last:pb-0">
            <span className="absolute -left-[2.55rem] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-bold text-accent md:-left-[3.55rem]">
              {step.n}
            </span>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{step.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </Reveal>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/devis">Obtenir mon devis</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/services">Voir les prestations</Link>
        </Button>
      </div>
    </div>
  );
}
