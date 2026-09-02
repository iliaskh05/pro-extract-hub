import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { Reveal } from "@/components/Reveal";
import { SECTORS } from "@/lib/sectors";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/secteurs/")({
  head: () =>
    pageHead({
      title: `Secteurs d'activité | ${SITE.name}`,
      description:
        "Restaurants, hôtels, fast-foods, boulangeries, pâtisseries, traiteurs et cuisines collectives : besoins et services adaptés à chaque établissement.",
      path: "/secteurs",
    }),
  component: SecteursIndex,
});

function SecteursIndex() {
  return (
    <>
      <PageHero
        eyebrow="Secteurs"
        title="Un accompagnement adapté à votre métier"
        description="Chaque type d'établissement a ses contraintes. Nous qualifions votre installation avant toute proposition."
        compact
      />
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <Link
                  to="/secteurs/$slug"
                  params={{ slug: s.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: s.imagePosition }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-semibold tracking-tight">{s.name}</h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      En savoir plus <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
