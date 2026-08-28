import { createFileRoute } from "@tanstack/react-router";
import { PENDING_COMPANY_INFO, SITE, displayValue } from "@/lib/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    pageHead({
      title: `Mentions légales | ${SITE.name}`,
      description: `Mentions légales du site ${SITE.name}.`,
      path: "/mentions-legales",
      ogTitle: `Mentions légales — ${SITE.name}`,
      ogDescription: "Informations légales du site.",
    }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mentions légales</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-xl border border-border bg-secondary/50 p-5 text-foreground">
          Certaines mentions restent à compléter par la direction avant publication officielle.
          Aucune information légale n'est inventée ici.
        </p>
        <section>
          <h2 className="text-base font-semibold text-foreground">Éditeur</h2>
          <p className="mt-2">
            {displayValue(SITE.legalName, `${SITE.name} — dénomination légale à confirmer`)}
            {SITE.legalForm ? ` — ${SITE.legalForm}` : ""}
            <br />
            Siège : {displayValue(SITE.address, "Adresse à confirmer")}
            <br />
            SIRET : {displayValue(SITE.siret, "À confirmer")}
            {SITE.vat ? ` — TVA : ${SITE.vat}` : ""}
            {SITE.capital ? ` — Capital : ${SITE.capital}` : ""}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Directeur de publication</h2>
          <p className="mt-2">{displayValue(SITE.director, "À confirmer")}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Téléphone : {displayValue(SITE.phone, "À confirmer")}
            <br />
            Email : {displayValue(SITE.email, "À confirmer")}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Hébergement</h2>
          <p className="mt-2">
            {displayValue(SITE.hosting, "Hébergeur à préciser lors de la mise en production.")}
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
