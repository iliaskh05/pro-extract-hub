import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES, ZONES, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FranceMap } from "@/components/FranceMap";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { MethodSteps } from "@/components/MethodSteps";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";
import { FAQ } from "@/lib/faq";
import { toast } from "sonner";

export const Route = createFileRoute("/zones/$slug")({
  loader: ({ params }) => {
    const zone = ZONES.find((z) => z.slug === params.slug);
    if (!zone) throw notFound();
    return { zone };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Zone indisponible | Extraction Pro" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { zone } = loaderData;
    return {
      meta: [
        { title: `Dégraissage de hotte — ${zone.name} | Extraction Pro` },
        {
          name: "description",
          content: `Dégraissage et entretien des systèmes d'extraction de cuisines professionnelles sur ${zone.name}.`,
        },
        { property: "og:title", content: `${zone.name} — Extraction Pro` },
        { property: "og:description", content: zone.description },
        { property: "og:url", content: `/zones/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/zones/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: `Extraction Pro — ${zone.name}`,
            areaServed: zone.name,
          }),
        },
      ],
    };
  },
  component: ZoneDetail,
});

function ZoneDetail() {
  const { zone } = Route.useLoaderData();
  const wa = whatsappLink(`Bonjour, j'ai un établissement sur ${zone.name}.`);
  const localFaq = FAQ.filter((f) => /où|zone|établissement|devis|rapport/i.test(f.q)).slice(0, 4);

  return (
    <div>
      <PageHero
        eyebrow={`Pôle ${zone.short}`}
        title={`Entretien des systèmes d'extraction — ${zone.name}`}
        description={zone.description}
        image={MEDIA.heroKitchen}
        imageAlt={`Cuisine professionnelle — ${zone.name}`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="inverse">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-ink-border bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            onClick={() => {
              if (wa) window.open(wa, "_blank", "noopener");
              else
                toast.info("Prototype — WhatsApp non connecté", {
                  description: "Le numéro sera renseigné avant la mise en ligne.",
                });
            }}
          >
            WhatsApp
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <FranceMap highlight={zone.slug} />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow text-accent">Zone géographique</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              {zone.name}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {zone.description}
            </p>

            <h3 className="mt-12 text-lg font-semibold tracking-tight">
              Prestations disponibles sur ce pôle
            </h3>
            <ul className="mt-4">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex items-center justify-between gap-4 border-t border-border py-4 text-sm font-medium"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {s.title}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-accent">Méthode</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Processus d'intervention
            </h2>
          </Reveal>
          <div className="mt-10">
            <MethodSteps />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="eyebrow text-accent">FAQ locale</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Les questions les plus fréquentes
          </h2>
        </Reveal>
        <FaqExplorer items={localFaq} className="mt-10" />
      </section>

      <FinalCta title={`Un devis pour ${zone.short} ?`} />
    </div>
  );
}
