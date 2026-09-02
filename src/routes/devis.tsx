import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Clock, FileCheck, Shield } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FinalCta } from "@/components/FinalCta";
import { FAQ } from "@/lib/faq";
import { SITE, zonesLine } from "@/lib/site";
import { pageHead } from "@/lib/seo";

const BENEFITS = [
  { icon: Clock, text: "Environ 2 minutes pour décrire votre installation" },
  { icon: Camera, text: "Photos optionnelles pour accélérer la qualification" },
  { icon: FileCheck, text: "Réponse après analyse de votre demande" },
  { icon: Shield, text: "Données traitées conformément à notre politique de confidentialité" },
] as const;

const DEVIS_FAQ = FAQ.filter((f) => ["Prix", "Intervention", "Général"].includes(f.category)).slice(
  0,
  4,
);

export const Route = createFileRoute("/devis")({
  head: () =>
    pageHead({
      title: `Obtenir un devis de dégraissage de hotte | ${SITE.name}`,
      description: `Décrivez votre installation en 5 étapes et recevez une proposition adaptée à votre cuisine professionnelle à ${zonesLine(" ou ")}.`,
      path: "/devis",
      ogTitle: `Obtenir un devis — ${SITE.name}`,
      ogDescription: "Demande de devis en 5 étapes pour l'entretien de votre système d'extraction.",
    }),
  component: DevisPage,
});

function DevisPage() {
  return (
    <div>
      <section className="surface-ink border-b border-ink-border">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <p className="eyebrow text-accent">Demande de devis</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-ink-foreground sm:text-4xl">
            Décrivez votre installation en 5 étapes
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Plus votre description est précise, plus notre proposition sera adaptée. Aucun
            engagement à ce stade.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <li
                key={b.text}
                className="flex items-start gap-3 rounded-xl border border-ink-border bg-ink-foreground/5 px-4 py-3 text-sm text-ink-muted"
              >
                <b.icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {b.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
          <QuoteForm />
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Vos informations servent uniquement à qualifier la demande.{" "}
            <Link to="/confidentialite" className="underline-offset-4 hover:underline">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>

      {DEVIS_FAQ.length > 0 && (
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
            <h2 className="text-2xl font-semibold tracking-tight">Questions fréquentes</h2>
            <FaqExplorer items={DEVIS_FAQ} className="mt-8" />
          </div>
        </section>
      )}

      <FinalCta
        title="Besoin d'échanger avant de remplir le formulaire ?"
        subtitle="Contactez-nous — nous vous orienterons vers la bonne démarche."
      />
    </div>
  );
}
