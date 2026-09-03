import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { saveQuotePrefill } from "@/lib/quote-prefill";
import { getSector, SECTORS, sectorDevisSearch, type Sector } from "@/lib/sectors";
import { SERVICES, SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/secteurs/$slug")({
  head: ({ params }) => {
    const sector = getSector(params.slug);
    if (!sector) return { meta: [{ title: "Secteur introuvable" }] };
    return pageHead({
      title: `${sector.title} | ${SITE.name}`,
      description: sector.seoDescription,
      path: `/secteurs/${sector.slug}`,
    });
  },
  loader: ({ params }) => {
    const sector = getSector(params.slug);
    if (!sector) throw notFound();
    return sector;
  },
  component: SectorPage,
});

function SectorPage() {
  const sector = Route.useLoaderData() as Sector;

  const sectorServices = SERVICES.filter((s) => sector.services.includes(s.slug));

  return (
    <>
      <PageHero
        eyebrow={sector.name}
        title={sector.title}
        description={sector.description}
        compact
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight">Besoins spécifiques</h2>
              <ul className="mt-6 space-y-3">
                {sector.needs.map((n) => (
                  <li key={n} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-accent">·</span> {n}
                  </li>
                ))}
              </ul>
              <h3 className="mt-10 text-lg font-semibold">Contraintes horaires</h3>
              <ul className="mt-4 space-y-2">
                {sector.constraints.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-2xl font-semibold tracking-tight">Services adaptés</h2>
              <div className="mt-6 space-y-4">
                {sectorServices.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-xl border border-border p-5 transition-colors hover:border-accent hover:bg-secondary/50"
                  >
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.short}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Demande contextualisée</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Le formulaire est prérempli pour {sector.name.toLowerCase()}.
            </p>
          </Reveal>
          <div className="mt-10">
            <QuoteForm
              prefill={{
                business_type: sector.businessType,
                landing_page: `/secteurs/${sector.slug}`,
                service_source: sector.slug,
              }}
            />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link
              to="/devis"
              search={sectorDevisSearch(sector)}
              className="underline-offset-4 hover:underline"
            >
              Ouvrir le devis en pleine page
            </Link>
          </p>
        </div>
      </section>

      <FinalCta
        title={`Un projet ${sector.name.toLowerCase()} ?`}
        subtitle="Décrivez votre installation — nous qualifions avant toute proposition."
      />
    </>
  );
}
