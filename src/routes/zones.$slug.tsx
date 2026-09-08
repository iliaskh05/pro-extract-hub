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
import { IleDeFranceMap } from "@/components/IleDeFranceMap";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { MethodSteps } from "@/components/MethodSteps";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FinalCta } from "@/components/FinalCta";
import { IDF_DEPARTMENTS } from "@/lib/idf-departments";
import { MEDIA } from "@/lib/media";
import { FAQ } from "@/lib/faq";
import { track } from "@/lib/analytics";
import { toast } from "sonner";
import { pageHead, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/zones/$slug")({
  loader: ({ params }) => {
    const zone = getZone(params.slug);
    if (!zone) throw notFound();
    return { zone };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return pageHead({
        title: `Zone indisponible | ${SITE.name}`,
        description: "Cette zone d'intervention n'est pas disponible.",
        path: `/zones/${params.slug}`,
        noindex: true,
      });
    }
    const { zone } = loaderData;
    return pageHead({
      title: `${zone.heroTitle} | ${SITE.name}`,
      description: `${zone.localIntro} Devis et intervention documentée.`,
      path: `/zones/${params.slug}`,
      ogTitle: `${zone.name} — ${SITE.name}`,
      ogDescription: zone.description,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: `${SITE.name} — ${zone.name}`,
        url: absoluteUrl(`/zones/${params.slug}`),
        areaServed: `${zone.name} / ${zone.region}`,
        provider: { "@type": "ProfessionalService", name: SITE.name },
      },
    });
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
          <Button asChild size="lg" className="h-12 rounded-sm px-7">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-sm px-7"
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
            <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.045em] md:text-4xl">
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

            <h3 className="font-display mt-12 text-lg font-bold tracking-tight">
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

        {zone.slug === "paris" && (
          <Reveal className="mt-16 space-y-6" delay={60}>
            <div>
              <p className="eyebrow text-accent">Île-de-France</p>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-[-0.04em] md:text-3xl">
                Départements desservis depuis Paris
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Survolez la carte : Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93),
                Val-de-Marne (94), Val-d'Oise (95), Yvelines (78), Essonne (91) et Seine-et-Marne
                (77).
              </p>
            </div>
            <IleDeFranceMap />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {IDF_DEPARTMENTS.map((d) => (
                <li
                  key={d.code}
                  className="rounded-sm border border-border bg-secondary/30 px-4 py-3"
                >
                  <p className="font-display text-sm font-bold tracking-tight">
                    {d.name}{" "}
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      ({d.code})
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{d.hub}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
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
