import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | Extraction Pro" },
      {
        name: "description",
        content:
          "Traitement des données transmises via le formulaire de devis — prototype de présentation.",
      },
      { property: "og:title", content: "Politique de confidentialité — Extraction Pro" },
      { property: "og:description", content: "Traitement des données du formulaire de devis." },
      { property: "og:url", content: "/confidentialite" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Politique de confidentialité
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Prototype de présentation : ce texte devra être validé juridiquement avant la mise en
          ligne.
        </p>
        <section>
          <h2 className="text-base font-semibold text-foreground">Données collectées</h2>
          <p className="mt-2">
            Le formulaire de devis collecte : nom, entreprise, téléphone, email, type
            d'établissement, ville, code postal et informations techniques sur l'installation.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Finalité</h2>
          <p className="mt-2">
            Ces données servent uniquement à qualifier la demande, établir une proposition et
            assurer le suivi commercial.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Conservation et droits</h2>
          <p className="mt-2">
            Durée de conservation et modalités d'exercice des droits (accès, rectification,
            suppression, opposition) à préciser avec la direction.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Cookies</h2>
          <p className="mt-2">
            Ce prototype ne dépose pas de cookie de mesure d'audience. Une bannière de consentement
            sera ajoutée si des outils d'analyse sont activés.
          </p>
        </section>
      </div>
    </div>
  ),
});
