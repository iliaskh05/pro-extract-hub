import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { SERVICE_VISUALS, GALLERY } from "@/lib/media";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { MethodSteps } from "@/components/MethodSteps";
import { FinalCta } from "@/components/FinalCta";
import { Button } from "@/components/ui/button";
import { SERVICE_ICONS } from "@/lib/ui-icons";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageHead({
      title: "Nos prestations d'entretien d'extraction | Salis3Hottes",
      description:
        "Dégraissage de hotte, nettoyage des filtres, des conduits, du moteur et du caisson, entretien périodique et diagnostic pour cuisines professionnelles.",
      path: "/services",
      ogTitle: "Nos prestations — Salis3Hottes",
      ogDescription:
        "Six prestations d'entretien des systèmes d'extraction de cuisines professionnelles.",
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
        <Button asChild size="lg" className="group h-12 rounded-sm px-7">
          <Link to="/devis">
            Demander un devis
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </PageHero>

      <section className="bg-background">
        <div className="shell section-y">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.slug];
              if (!Icon) return null;
              return (
                <Reveal key={s.slug} delay={i * 50} className="bg-background">
                  <ServiceCard icon={Icon} title={s.title} text={s.short} slug={s.slug} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="surface-ink" data-header-tone="dark">
        <div className="shell section-y">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Avant / Après"
              title="Le résultat, en un regard."
              description="Une différence visible, mesurable et réalisée sur site."
            />
          </Reveal>
          <Reveal variant="mask" className="mt-12">
            <BeforeAfterSlider
              before={featured.before}
              after={featured.after}
              alt={featured.title}
              objectPosition={featured.objectPosition}
              beforeTreatment={featured.beforeTreatment}
              className="rounded-sm"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        <div className="shell section-y">
          <Reveal>
            <SectionHeading
              eyebrow="Méthode"
              title="Six étapes d'intervention"
              description="Une intervention maîtrisée, de l'analyse au suivi."
            />
          </Reveal>
          <div className="mt-12">
            <MethodSteps />
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
