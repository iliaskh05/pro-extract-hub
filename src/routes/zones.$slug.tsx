import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SERVICES, ZONES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FranceMap } from "@/components/FranceMap";

export const Route = createFileRoute("/zones/$slug")({
  loader: ({ params }) => {
    const zone = ZONES.find((z) => z.slug === params.slug);
    if (!zone) throw notFound();
    return { zone };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Zone indisponible | Extraction Pro" }, { name: "robots", content: "noindex" }],
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="eyebrow text-accent">Pôle {zone.short}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">
        Entretien des systèmes d'extraction — {zone.name}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">{zone.description}</p>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
        <FranceMap highlight={zone.slug} />
        <div>
          <h2 className="text-xl font-bold tracking-tight">Prestations disponibles sur ce pôle</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="block rounded-xl border border-border bg-card p-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/60"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/devis">Obtenir mon devis</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/zones">Voir les deux pôles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
