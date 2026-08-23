import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { FaqExplorer } from "@/components/FaqExplorer";
import { Input } from "@/components/ui/input";
import { FAQ } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Questions fréquentes sur le dégraissage de hotte | Extraction Pro" },
      {
        name: "description",
        content:
          "Établissements accompagnés, zones desservies, déroulé d'une intervention, rapport, fréquence d'entretien : les réponses aux questions les plus fréquentes.",
      },
      { property: "og:title", content: "FAQ — Extraction Pro" },
      {
        property: "og:description",
        content: "Les réponses aux questions fréquentes sur l'entretien des systèmes d'extraction.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ;
    return FAQ.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        description="Sur les points réglementaires, nous restons volontairement prudents : ces réponses seront validées avec la direction avant la mise en ligne."
        compact
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="relative max-w-md">
            <label htmlFor="faq-search" className="sr-only">
              Rechercher dans la FAQ
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="faq-search"
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question…"
            />
          </div>

          {items.length > 0 ? (
            <FaqExplorer key={query} items={items} className="mt-12" />
          ) : (
            <p className="mt-12 text-sm text-muted-foreground">
              Aucun résultat pour cette recherche. Reformulez ou posez-nous directement la question.
            </p>
          )}
        </div>
      </section>

      <FinalCta
        title="Votre question n'est pas listée ?"
        subtitle="Décrivez votre installation, nous vous répondons avec le niveau de détail nécessaire."
      />
    </>
  );
}
