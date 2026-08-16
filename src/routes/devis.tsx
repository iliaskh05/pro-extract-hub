import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/QuoteForm";

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Obtenir un devis de dégraissage de hotte | Extraction Pro" },
      {
        name: "description",
        content:
          "Décrivez votre installation en 5 étapes (établissement, hotte, filtres, conduit, moteur) et recevez une proposition adaptée à votre cuisine professionnelle.",
      },
      { property: "og:title", content: "Obtenir un devis — Extraction Pro" },
      {
        property: "og:description",
        content: "Demande de devis en 5 étapes pour l'entretien de votre système d'extraction.",
      },
      { property: "og:url", content: "/devis" },
    ],
    links: [{ rel: "canonical", href: "/devis" }],
  }),
  component: DevisPage,
});

function DevisPage() {
  return (
    <div className="bg-secondary/40">
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <p className="eyebrow text-accent">Demande de devis</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          Décrivez votre installation
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Cinq étapes, environ deux minutes. Plus votre description est précise, plus notre
          proposition sera juste.
        </p>
        <div className="mt-10">
          <QuoteForm />
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Prototype de démonstration : les données envoyées sont enregistrées dans la base de
          démonstration du futur CRM.
        </p>
      </div>
    </div>
  );
}
