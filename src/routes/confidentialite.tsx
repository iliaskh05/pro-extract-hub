import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE, displayValue } from "@/lib/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/confidentialite")({
  head: () =>
    pageHead({
      title: `Politique de confidentialité | ${SITE.name}`,
      description: `Traitement des données transmises via le formulaire de devis de ${SITE.name}.`,
      path: "/confidentialite",
      ogTitle: `Politique de confidentialité — ${SITE.name}`,
      ogDescription: "Traitement des données du formulaire de devis.",
    }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Politique de confidentialité
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Ce texte décrit le traitement prévu. Il devra être validé juridiquement avant la mise en
          ligne définitive.
        </p>
        <section>
          <h2 className="text-base font-semibold text-foreground">Responsable</h2>
          <p className="mt-2">
            {displayValue(SITE.legalName, SITE.name)} —{" "}
            {displayValue(SITE.email, "email à confirmer")}.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Données collectées</h2>
          <p className="mt-2">
            Le formulaire de devis collecte : nom, entreprise, téléphone, email, type
            d'établissement, ville, code postal, informations techniques sur l'installation,
            photographies éventuellement transmises, préférence de contact et consentement.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Finalité</h2>
          <p className="mt-2">
            Ces données servent à qualifier la demande, établir une proposition, assurer le suivi
            commercial et, le cas échéant, envoyer un accusé de réception.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Conservation et droits</h2>
          <p className="mt-2">
            Durée de conservation, sous-traitants et modalités d'exercice des droits (accès,
            rectification, suppression, opposition) seront précisés avec la direction. Vous pouvez
            nous écrire à l'adresse de contact dès qu'elle est publiée.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Cookies</h2>
          <p className="mt-2">
            Les cookies essentiels assurent le fonctionnement du site. La mesure d'audience et les
            cookies marketing ne sont activés qu'après consentement. Vous pouvez modifier votre
            choix depuis le bandeau, ou en effaçant les données du site dans votre navigateur.
          </p>
        </section>
        <p>
          <Link to="/mentions-legales" className="underline-offset-4 hover:underline">
            Mentions légales
          </Link>
        </p>
      </div>
    </div>
  ),
});
