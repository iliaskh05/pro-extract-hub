import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { SERVICE_VISUALS, GALLERY } from "@/lib/media";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { MethodSteps } from "@/components/MethodSteps";
import { FinalCta } from "@/components/FinalCta";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Nos prestations d'entretien d'extraction | Extraction Pro" },
      {
        name: "description",
        content:
          "Dégraissage de hotte, nettoyage des filtres, des conduits, du moteur et du caisson, entretien périodique et diagnostic pour cuisines professionnelles.",
      },
      { property: "og:title", content: "Nos prestations — Extraction Pro" },
      {
        property: "og:description",
        content:
          "Six prestations d'entretien des systèmes d'extraction de cuisines professionnelles.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const featured = GALLERY[0]!;

  return (
    <div>
      <PageHero
        eyebrow="Prestations"
        title="Un entretien complet du système d'extraction"
        description="Chaque prestation est adaptée à la configuration réelle de votre installation."
        image={SERVICE_VISUALS["degraissage-hotte"]!.image}
        imageAlt="Hotte professionnelle en inox"
      >
        <Button asChild size="lg" variant="inverse">
          <Link to="/devis">Obtenir mon devis</Link>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <ol>
          {SERVICES.map((s, i) => {
            const visual = SERVICE_VISUALS[s.slug]!;
            return (
              <Reveal as="li" key={s.slug} delay={i * 40}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group grid items-center gap-6 border-t border-border py-8 lg:grid-cols-12 lg:gap-10 lg:py-12"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent lg:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn("lg:col-span-4", i % 2 === 1 && "lg:order-last lg:col-span-4")}
                  >
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-1 lg:text-3xl">
                      {s.title}
                    </h2>
                    <span className="mt-3 block max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {s.short}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                      En savoir plus
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </span>
                  <span className="overflow-hidden rounded-2xl lg:col-span-7">
                    <img
                      src={visual.image}
                      alt={visual.alt}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-accent">Avant / Après</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-ink-foreground md:text-4xl">
              Le résultat se constate
            </h2>
          </Reveal>
          <Reveal variant="mask" className="mt-10">
            <BeforeAfterSlider
              before={featured.before}
              after={featured.after}
              alt={featured.title}
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="eyebrow text-accent">Méthode</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Six étapes d'intervention
          </h2>
        </Reveal>
        <div className="mt-10">
          <MethodSteps />
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
