import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE, displayValue } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { openConsentManager } from "@/lib/analytics";

const TODO = "[À COMPLÉTER]";

export const Route = createFileRoute("/confidentialite")({
  head: () =>
    pageHead({
      title: `Politique de confidentialité | ${SITE.name}`,
      description: `Données personnelles, finalités, durées de conservation, cookies et droits RGPD sur le site ${SITE.name}.`,
      path: "/confidentialite",
      ogTitle: `Politique de confidentialité — ${SITE.name}`,
      ogDescription: "Traitement des données personnelles et cookies.",
    }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Politique de confidentialité
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Dernière mise à jour : 22 septembre 2026 — document à faire valider juridiquement avant
        publication définitive.
      </p>

      <div className="mt-8 space-y-7 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Les mentions marquées {TODO} doivent être renseignées par la direction de{" "}
          {SITE.name}. Aucune information légale n'est inventée ici.
        </p>

        <Section title="1. Responsable du traitement">
          <p>
            {displayValue(SITE.legalName, `${SITE.name} — dénomination légale ${TODO}`)}
            {SITE.legalForm ? ` (${SITE.legalForm})` : ` — forme juridique ${TODO}`}
            <br />
            Siège : {displayValue(SITE.address, TODO)}
            <br />
            SIREN / SIRET : {displayValue(SITE.siret, TODO)}
            <br />
            Téléphone : {displayValue(SITE.phone, TODO)}
            <br />
            Contact données personnelles : par téléphone au {SITE.phone} ou par e-mail à{" "}
            {displayValue(SITE.email, TODO)}
          </p>
          <p>Aucun délégué à la protection des données n'est désigné à ce jour.</p>
        </Section>

        <Section title="2. Données collectées">
          <p>
            <strong className="text-foreground">Demande de devis</strong> : nom, entreprise, type
            d'établissement, téléphone, e-mail, ville et code postal d'intervention, informations
            techniques sur l'installation (type de hotte, filtres, conduits, moteur, urgence),
            photos que vous transmettez volontairement, préférence de contact et message libre.
          </p>
          <p>
            <strong className="text-foreground">Contact direct</strong> : les informations que vous
            communiquez par téléphone, WhatsApp ou e-mail.
          </p>
          <p>
            <strong className="text-foreground">Assistance en ligne</strong> : le contenu des
            messages échangés avec l'assistant du site, afin de vous orienter.
          </p>
          <p>
            <strong className="text-foreground">Données techniques</strong> : journaux serveur
            (adresse IP, horodatage) nécessaires à la sécurité et à la limitation des abus, et
            statistiques de fréquentation uniquement si vous les acceptez.
          </p>
          <p>
            Merci de ne pas transmettre de données sensibles (santé, opinions, etc.) : elles ne sont
            pas nécessaires au traitement de votre demande.
          </p>
        </Section>

        <Section title="3. Finalités et bases légales">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Répondre à votre demande de devis et préparer l'intervention — mesures
              précontractuelles à votre demande (art. 6.1.b RGPD).
            </li>
            <li>
              Suivi commercial de la relation et gestion du fichier clients/prospects
              professionnels — intérêt légitime (art. 6.1.f RGPD).
            </li>
            <li>
              Sécurité du site et prévention des abus (anti-spam, limitation du nombre d'envois) —
              intérêt légitime (art. 6.1.f RGPD).
            </li>
            <li>
              Mesure d'audience, marketing et services tiers — votre consentement (art. 6.1.a
              RGPD), retirable à tout moment.
            </li>
            <li>
              Obligations comptables et fiscales en cas de prestation facturée — obligation légale
              (art. 6.1.c RGPD).
            </li>
          </ul>
          <p>
            Une demande de devis ne vaut pas acceptation de recevoir des communications marketing.
            Aucune inscription à une newsletter n'est proposée sur le site à ce jour ; si elle est
            ajoutée, elle fera l'objet d'un consentement distinct et d'un lien de désinscription.
          </p>
        </Section>

        <Section title="4. Destinataires et sous-traitants">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Les personnes habilitées de {SITE.name} en charge des devis et des interventions
              (accès à l'espace de gestion protégé par authentification et par rôle).
            </li>
            <li>
              Hébergement du site et de l'espace de gestion : {displayValue(SITE.hosting, TODO)}.
            </li>
            <li>
              Base de données et stockage des photos de devis : Supabase (infrastructure de
              l'application) — région d'hébergement : {TODO}.
            </li>
            <li>
              Mesure d'audience (uniquement après consentement) : Plausible Analytics, sans cookie
              publicitaire ni revente de données.
            </li>
            <li>
              Partenaires intervenants qualifiés mobilisés uniquement pour exécuter la prestation
              demandée ({SITE.name} agit comme coordonnateur). La liste des partenaires mobilisés
              pour votre intervention est disponible sur demande.
            </li>
          </ul>
          <p>Vos données ne sont ni vendues, ni louées, ni échangées.</p>
        </Section>

        <Section title="5. Durées de conservation">
          <ul className="list-disc space-y-1 pl-5">
            <li>Demande de devis sans suite : 3 ans après le dernier contact.</li>
            <li>
              Client avec prestation réalisée : données de contact 3 ans après la fin de la relation
              commerciale ; pièces comptables et factures 10 ans (obligation légale).
            </li>
            <li>
              Photos transmises : le temps du traitement de la demande ; supprimées au plus tard 12
              mois après le dernier contact si aucune prestation n'est réalisée.
            </li>
            <li>Journaux techniques de sécurité : 12 mois maximum.</li>
            <li>Preuve du consentement cookies : 6 mois, puis nouvelle demande.</li>
          </ul>
          <p>
            Ces durées correspondent aux recommandations courantes de la CNIL ; la direction peut
            les ajuster et le document sera alors mis à jour.
          </p>
        </Section>

        <Section title="6. Transferts hors Union européenne">
          <p>
            Le site vise un hébergement dans l'Union européenne. Certains prestataires techniques
            peuvent opérer des transferts hors UE encadrés par les clauses contractuelles types de
            la Commission européenne. Liste et localisation exactes des prestataires : {TODO}.
          </p>
          <p>
            Les polices d'écriture sont hébergées sur le site lui-même : aucune adresse IP n'est
            transmise à un service de polices tiers.
          </p>
        </Section>

        <Section title="7. Vos droits">
          <p>
            Vous disposez des droits d'accès, de rectification, d'effacement, de limitation,
            d'opposition (notamment à la prospection), de portabilité, et du droit de définir des
            directives post-mortem.
          </p>
          <p>
            Pour les exercer : par téléphone au {SITE.phone}, par e-mail à{" "}
            {displayValue(SITE.email, TODO)} ou par courrier à {displayValue(SITE.address, TODO)},
            en précisant votre demande. Une réponse vous sera apportée sous un mois ; une preuve
            d'identité peut être demandée en cas de doute raisonnable.
          </p>
          <p>
            Si la réponse ne vous satisfait pas, vous pouvez saisir la CNIL —{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              cnil.fr/fr/plaintes
            </a>{" "}
            — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
          </p>
        </Section>

        <Section title="8. Cookies et traceurs">
          <p>
            Le site n'utilise aucun cookie publicitaire par défaut. Sont déposés d'office uniquement
            les éléments strictement nécessaires : mémorisation de votre choix de cookies et, dans
            l'espace de gestion réservé, la session d'authentification.
          </p>
          <p>
            Soumis à votre consentement préalable : la mesure d'audience, le marketing et les
            contenus de services tiers. Tant que vous n'avez pas accepté la catégorie concernée,
            aucun script correspondant n'est chargé.
          </p>
          <p>
            Votre choix est conservé 6 mois maximum et peut être modifié ou retiré à tout moment.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => openConsentManager()}>
            Gérer mes cookies
          </Button>
        </Section>

        <Section title="9. Sécurité">
          <p>
            Le site est diffusé en HTTPS. L'accès aux demandes de devis est réservé aux comptes
            authentifiés disposant d'un rôle interne, avec des règles d'accès appliquées côté base
            de données. Les formulaires sont protégés contre les envois automatisés et limités en
            fréquence.
          </p>
        </Section>

        <p>
          <Link to="/mentions-legales" className="underline-offset-4 hover:underline">
            Mentions légales
          </Link>
        </p>
      </div>
    </div>
  );
}
