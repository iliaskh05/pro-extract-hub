import { createFileRoute, Link } from "@tanstack/react-router";
import { QuoteForm } from "@/components/QuoteForm";
import { PageHero } from "@/components/PageHero";
import { SITE, zonesLine } from "@/lib/site";

const STEPS = [
  "01 Établissement",
  "02 Installation",
  "03 Localisation",
  "04 Photos",
  "05 Coordonnées",
];

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: `Obtenir un devis de dégraissage de hotte | ${SITE.name}` },
      {
        name: "description",
        content: `Décrivez votre installation en 5 étapes et recevez une proposition adaptée à votre cuisine professionnelle à ${zonesLine(" ou ")}.`,
      },
      { property: "og:title", content: `Obtenir un devis — ${SITE.name}` },
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
    <div>
      <PageHero
        eyebrow="Demande de devis"
        title="Décrivez votre installation"
        description="Cinq étapes, environ deux minutes. Plus votre description est précise, plus notre proposition sera juste."
        compact
      >
        <ol className="flex flex-wrap gap-2 text-[11px] font-medium tracking-[0.12em] text-ink-muted uppercase">
          {STEPS.map((s) => (
            <li
              key={s}
              className="rounded-full border border-ink-border bg-ink-foreground/5 px-3.5 py-1.5"
            >
              {s}
            </li>
          ))}
        </ol>
      </PageHero>

      <div className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
          <QuoteForm />
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Vos informations servent uniquement à qualifier la demande.{" "}
            <Link to="/confidentialite" className="underline-offset-4 hover:underline">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
