import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SERVICES, activeZones } from "@/lib/site";
import { SERVICE_VISUALS, GALLERY } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { MethodSteps } from "@/components/MethodSteps";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FinalCta } from "@/components/FinalCta";
import { FAQ } from "@/lib/faq";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Prestation indisponible | Salis 3 Hottes" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.title} — cuisines professionnelles | Salis 3 Hottes` },
        { name: "description", content: service.description.slice(0, 155) },
        { property: "og:title", content: `${service.title} | Salis 3 Hottes` },
        { property: "og:description", content: service.short },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            areaServed: activeZones().map((zone) => `${zone.name} / ${zone.region}`),
            provider: { "@type": "ProfessionalService", name: "Salis 3 Hottes" },
          }),
        },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);
  const visual = SERVICE_VISUALS[service.slug] ?? SERVICE_VISUALS["degraissage-hotte"]!;
  const demo =
    GALLERY.find((g) => g.type.toLowerCase().includes(service.title.toLowerCase().slice(0, 8))) ??
    GALLERY[0]!;
  const relatedFaq = FAQ.slice(0, 5);

  return (
    <div>
      <PageHero
        eyebrow="Prestation"
        title={service.title}
        description={service.description}
        image={visual.image}
        imageAlt={visual.alt}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="inverse">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-ink-border bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
          >
            <Link to="/contact">Parler à un expert</Link>
          </Button>
        </div>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
        >
          <ArrowLeft className="size-4" /> Toutes les prestations
        </Link>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal variant="mask">
                <img
                  src={visual.image}
                  alt={visual.alt}
                  loading="lazy"
                  width={1400}
                  height={1050}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-5 text-sm leading-relaxed text-muted-foreground">
                  Le périmètre exact et la durée dépendent de la configuration de votre
                  installation. Ils sont confirmés lors de la qualification, avant toute
                  intervention.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-accent">Périmètre</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Ce que comprend l'intervention
              </h2>
            </Reveal>
            <ul className="mt-10">
              {service.points.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 50}>
                  <div className="flex gap-4 border-t border-border py-5">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed">{p}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-accent">Démonstration</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-foreground md:text-4xl">
              Avant / après
            </h2>
          </Reveal>
          <Reveal variant="mask" className="mt-10">
            <BeforeAfterSlider before={demo.before} after={demo.after} alt={demo.title} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="eyebrow text-accent">Méthode</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Processus</h2>
        </Reveal>
        <div className="mt-10">
          <MethodSteps />
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-accent">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Questions fréquentes
            </h2>
          </Reveal>
          <FaqExplorer items={relatedFaq} className="mt-10" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">Autres prestations</h2>
        <ul className="mt-6">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex items-center justify-between gap-6 border-t border-border py-6"
              >
                <span>
                  <span className="block text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                    {s.title}
                  </span>
                  <span className="mt-1 block max-w-md text-sm text-muted-foreground">
                    {s.short}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta />
    </div>
  );
}
