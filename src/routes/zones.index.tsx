import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ZONES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FranceMap } from "@/components/FranceMap";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";

type ZoneSlug = (typeof ZONES)[number]["slug"];

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
  const [hovered, setHovered] = useState<ZoneSlug | undefined>(undefined);

  return (
    <div>
      <PageHero
        eyebrow="Zones d'intervention"
        title="Deux pôles, une même exigence"
        description="Nous n'annonçons que les zones réellement desservies."
        image={MEDIA.heroKitchen}
        imageAlt="Cuisine professionnelle"
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <FranceMap highlight={hovered} />
          </Reveal>

          <Reveal delay={80}>
            <ol>
              {ZONES.map((z, i) => (
                <li
                  key={z.slug}
                  onMouseEnter={() => setHovered(z.slug)}
                  onMouseLeave={() => setHovered(undefined)}
                  className="border-t border-border py-8 last:border-b"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] lg:text-3xl">
                    {z.name}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {z.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <Button asChild size="sm">
                      <Link to="/devis">Obtenir mon devis</Link>
                    </Button>
                    <Link
                      to="/zones/$slug"
                      params={{ slug: z.slug }}
                      onFocus={() => setHovered(z.slug)}
                      onBlur={() => setHovered(undefined)}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium"
                    >
                      Détails du pôle
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Une adresse en limite de zone ? Indiquez-la dans votre demande, nous confirmons la
              faisabilité avant toute proposition.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta title="Votre établissement est-il dans notre zone ?" />
    </div>
  );
}
