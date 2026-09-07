import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";
import { METHOD } from "@/lib/method";
import { METHOD_ICONS } from "@/lib/ui-icons";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/methode")({
  head: () =>
    pageHead({
      title: "Notre méthode d'intervention en 6 étapes | Salis3Hottes",
      description:
        "Analyse, préparation, dégraissage, contrôle, documentation et suivi : la méthode d'intervention appliquée à chaque système d'extraction.",
      path: "/methode",
      ogTitle: "Notre méthode — Salis3Hottes",
      ogDescription: "Six étapes documentées, de l'analyse au suivi de votre installation.",
    }),
  component: MethodPage,
});

function MethodPage() {
  return (
    <div>
      <PageHero
        eyebrow="Notre méthode"
        title="Une intervention maîtrisée, de l'analyse au contrôle final."
        description="Six étapes, documentées à chaque passage."
        image={MEDIA.ductDetail}
        imageAlt="Détail d'un système d'extraction professionnel"
      >
        <Button asChild size="lg" className="group h-12 rounded-sm px-7">
          <Link to="/devis">
            Demander un devis
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </PageHero>

      {/* Timeline éditoriale : verticale sur mobile, en colonnes larges sur desktop */}
      <section className="bg-background">
        <div className="shell section-y">
          <ol>
            {METHOD.map((step, i) => {
              const Icon = METHOD_ICONS[step.n];
              return (
                <Reveal
                  as="li"
                  key={step.n}
                  delay={i * 60}
                  className="grid gap-4 border-t border-border py-10 lg:grid-cols-12 lg:gap-10 lg:py-14"
                >
                  <div className="flex items-center gap-4 lg:col-span-3">
                    <span className="text-4xl font-semibold tracking-[-0.05em] text-accent lg:text-6xl">
                      {step.n}
                    </span>
                    {Icon && (
                      <Icon
                        className="size-5 stroke-[1.4] text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] lg:col-span-3 lg:text-2xl">
                    {step.title}
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground lg:col-span-6">
                    {step.text}
                  </p>
                </Reveal>
              );
            })}
          </ol>

          <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild size="lg" className="group h-12 rounded-sm px-7">
              <Link to="/devis">
                Demander un devis
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-sm px-7">
              <Link to="/services">Voir les prestations</Link>
            </Button>
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
