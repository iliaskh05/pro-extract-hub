import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  SERVICES,
  SITE,
  getZone,
  whatsappLink,
  whatsappUnavailableMessage,
  type ZoneSlug,
} from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FranceMap } from "@/components/FranceMap";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { MethodSteps } from "@/components/MethodSteps";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";
import { FAQ } from "@/lib/faq";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

export const Route = createFileRoute("/zones/$slug")({
  loader: ({ params }) => {
    const zone = getZone(params.slug);
    if (!zone) throw notFound();
    return { zone };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Zone indisponible | ${SITE.name}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { zone } = loaderData;
    return {
      meta: [
        { title: `${zone.heroTitle} | ${SITE.name}` },
        {
          name: "description",
          content: `${zone.localIntro} Devis et intervention documentée.`,
        },
        { property: "og:title", content: `${zone.name} — ${SITE.name}` },
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
            name: `${SITE.name} — ${zone.name}`,
            areaServed: `${zone.name} / ${zone.region}`,
            provider: { "@type": "ProfessionalService", name: SITE.name },
          }),
        },
      ],
    };
  },
  component: ZoneDetail,
});

function ZoneDetail() {
  const { zone } = Route.useLoaderData();
  const wa = whatsappLink(zone.whatsappMessage);
  const localFaq = [
    {
      q: `Intervenez-vous à ${zone.name} ?`,
      a: zone.coverage,
    },
    ...FAQ.filter((f) => /devis|rapport|établissement|déroule/i.test(f.q)).slice(0, 3),
  ];

  return (
    <div>
      <PageHero
        eyebrow={`${zone.name} · ${zone.region}`}
        title={zone.heroTitle}
        description={zone.localIntro}
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
              if (wa) {
                track("WhatsApp Click", { from: `zone-${zone.slug}` });
                window.open(wa, "_blank", "noopener");
              } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
            }}
          >
            WhatsApp
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <FranceMap highlight={zone.slug as ZoneSlug} />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow text-accent">Zone géographique</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              {zone.name}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {zone.coverage}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {zone.sectorsFocus}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {zone.useful.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>

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
              Processus d'intervention à {zone.name}
            </h2>
          </Reveal>
          <div className="mt-10">
            <MethodSteps />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="eyebrow text-accent">FAQ {zone.name}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Les questions les plus fréquentes
          </h2>
        </Reveal>
        <FaqExplorer items={localFaq} className="mt-10" />
      </section>

      <FinalCta title={`Un devis pour ${zone.name} ?`} />
    </div>
  );
}
