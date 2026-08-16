import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | Extraction Pro" },
      {
        name: "description",
        content: "Mentions légales du site — prototype de présentation, informations à compléter.",
      },
      { property: "og:title", content: "Mentions légales — Extraction Pro" },
      { property: "og:description", content: "Informations légales du site." },
      { property: "og:url", content: "/mentions-legales" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mentions légales</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Prototype de présentation : les informations légales ci-dessous sont des placeholders à
          compléter par la direction avant toute mise en ligne.
        </p>
        <section>
          <h2 className="text-base font-semibold text-foreground">Éditeur</h2>
          <p className="mt-2">
            {SITE.legalName} — {SITE.addressPlaceholder} — {SITE.siretPlaceholder}.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Téléphone : {SITE.phonePlaceholder} — Email : {SITE.emailPlaceholder}.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Hébergement</h2>
          <p className="mt-2">Hébergeur à préciser lors de la mise en production.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Propriété intellectuelle</h2>
          <p className="mt-2">
            Les contenus et visuels de ce prototype sont fournis à titre de démonstration.
          </p>
        </section>
      </div>
    </div>
  ),
});
