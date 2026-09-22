import { createFileRoute, Link } from "@tanstack/react-router";
import { PENDING_COMPANY_INFO, SITE, displayValue } from "@/lib/site";
import { pageHead } from "@/lib/seo";

const TODO = "[À COMPLÉTER]";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    pageHead({
      title: `Mentions légales | ${SITE.name}`,
      description: `Mentions légales du site ${SITE.name} : éditeur, directeur de publication, hébergeur et contact.`,
      path: "/mentions-legales",
      ogTitle: `Mentions légales — ${SITE.name}`,
      ogDescription: "Informations légales du site.",
    }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mentions légales</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Seules les informations fournies par la direction restent marquées {TODO}. Les durées de
          conservation, la date de mise à jour et le cadre des données sont déjà renseignés dans la
          politique de confidentialité.
        </p>
        <section>
          <h2 className="text-base font-semibold text-foreground">Éditeur du site</h2>
          <p className="mt-2">
            Raison sociale : {displayValue(SITE.legalName, TODO)}
            <br />
            Forme juridique : {displayValue(SITE.legalForm, TODO)}
            <br />
            Capital social : {displayValue(SITE.capital, `${TODO} (non applicable si entreprise individuelle)`)}
            <br />
            Siège social : {displayValue(SITE.address, TODO)}
            <br />
            SIREN : {displayValue(SITE.siren, TODO)} — SIRET : {displayValue(SITE.siret, TODO)}
            <br />
            RCS : {TODO} (selon immatriculation) — TVA intracommunautaire :{" "}
            {displayValue(SITE.vat, `${TODO} (selon régime de TVA)`)}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Directeur de la publication</h2>
          <p className="mt-2">{displayValue(SITE.director, TODO)}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Téléphone : {displayValue(SITE.phone, TODO)}
            <br />
            E-mail : {displayValue(SITE.email, TODO)}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Hébergeur</h2>
          <p className="mt-2">
            {displayValue(SITE.hosting, `Nom, adresse et téléphone de l'hébergeur : ${TODO}`)}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">
            Activité réglementée et assurance
          </h2>
          <p className="mt-2">
            Assurance responsabilité civile professionnelle (assureur et couverture
            géographique) : {TODO}.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Propriété intellectuelle</h2>
          <p className="mt-2">
            Les contenus, la marque {SITE.name} et les visuels officiels sont protégés. Les
            photographies d'installation identifiées « Démonstration » ne représentent pas des
            chantiers clients.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Données personnelles et cookies</h2>
          <p className="mt-2">
            Le traitement des données et la gestion des cookies sont décrits dans la{" "}
            <Link to="/confidentialite" className="underline-offset-4 hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Informations encore attendues</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {PENDING_COMPANY_INFO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  ),
});
