import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

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
        content: "Six prestations d'entretien des systèmes d'extraction de cuisines professionnelles.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-24">
      <p className="eyebrow text-accent">Prestations</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
        Un entretien complet du système d'extraction
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Chaque prestation est adaptée à la configuration réelle de votre installation.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={i * 60}>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lift"
            >
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 text-lg font-bold tracking-tight">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                En savoir plus
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
