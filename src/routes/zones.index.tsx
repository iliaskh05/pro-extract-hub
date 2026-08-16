import { createFileRoute, Link } from "@tanstack/react-router";
import { ZONES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FranceMap } from "@/components/FranceMap";

export const Route = createFileRoute("/zones/")({
  head: () => ({
    meta: [
      { title: "Zones d'intervention : Paris & Perpignan | Extraction Pro" },
      {
        name: "description",
        content:
          "Deux pôles d'intervention : Paris & Île-de-France, Perpignan & Pyrénées-Orientales. Vérifiez la couverture pour votre établissement.",
      },
      { property: "og:title", content: "Zones d'intervention — Extraction Pro" },
      {
        property: "og:description",
        content: "Paris & Île-de-France · Perpignan & Pyrénées-Orientales.",
      },
      { property: "og:url", content: "/zones" },
    ],
    links: [{ rel: "canonical", href: "/zones" }],
  }),
  component: ZonesPage,
});

function ZonesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-24">
      <p className="eyebrow text-accent">Zones d'intervention</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
        Deux pôles, une même exigence
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Nous n'annonçons que les zones réellement desservies.
      </p>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <FranceMap />
        <div className="space-y-5">
          {ZONES.map((z) => (
            <div key={z.slug} className="rounded-2xl border border-border bg-card p-7 shadow-card">
              <h2 className="text-lg font-bold tracking-tight">{z.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{z.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link to="/devis">Obtenir mon devis</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/zones/$slug" params={{ slug: z.slug }}>
                    Détails du pôle
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Une adresse en limite de zone ? Indiquez-la dans votre demande, nous confirmons la
            faisabilité avant toute proposition.
          </p>
        </div>
      </div>
    </div>
  );
}
