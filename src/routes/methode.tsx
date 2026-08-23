import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";
import { METHOD } from "@/lib/method";

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
    <div>
      <PageHero
        eyebrow="Notre méthode"
        title="Une intervention structurée, documentée de bout en bout"
        description="Analyse, préparation, dégraissage, contrôle, documentation et suivi."
        image={MEDIA.ductDetail}
        imageAlt="Détail d'un système d'extraction professionnel"
      >
        <Button asChild size="lg" variant="inverse">
          <Link to="/devis">Obtenir mon devis</Link>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <ol className="grid gap-y-2 lg:grid-cols-12">
          {METHOD.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              delay={i * 60}
              className="grid gap-4 border-t border-border py-8 lg:col-span-12 lg:grid-cols-12 lg:gap-10 lg:py-12"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent lg:col-span-2">
                {step.n}
              </span>
              <h2 className="text-2xl font-semibold tracking-[-0.035em] lg:col-span-4 lg:text-3xl">
                {step.title}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground lg:col-span-6">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/services">Voir les prestations</Link>
          </Button>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
