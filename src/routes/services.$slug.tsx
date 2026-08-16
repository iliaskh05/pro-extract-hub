import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import ductDetail from "@/assets/duct-detail.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Prestation indisponible | Extraction Pro" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.title} — cuisines professionnelles | Extraction Pro` },
        { name: "description", content: service.description.slice(0, 155) },
        { property: "og:title", content: `${service.title} | Extraction Pro` },
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
            areaServed: ["Paris / Île-de-France", "Perpignan / Pyrénées-Orientales"],
            provider: { "@type": "ProfessionalService", name: "Extraction Pro" },
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

  return (
    <div>
      <section className="surface-ink grid-tech">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
          >
            <ArrowLeft className="size-4" /> Toutes les prestations
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-ink-foreground md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {service.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/devis">Obtenir mon devis</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Parler à un expert</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ce que comprend l'intervention</h2>
          <ul className="mt-6 space-y-4">
            {service.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed">
                <Check className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-xl border border-border bg-secondary/60 p-5 text-sm text-muted-foreground">
            Le périmètre exact et la durée dépendent de la configuration de votre installation. Ils
            sont confirmés lors de la qualification, avant toute intervention.
          </p>
        </div>
        <img
          src={ductDetail}
          alt={`Installation d'extraction — ${service.title}`}
          loading="lazy"
          width={1400}
          height={900}
          className="h-full w-full rounded-2xl object-cover shadow-card"
        />
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
          <h2 className="text-xl font-bold tracking-tight">Autres prestations</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
              >
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
