import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, FileText } from "lucide-react";
import {
  SITE,
  activeZones,
  displayValue,
  zonesLine,
  emailHref,
  phoneHref,
  whatsappLink,
  whatsappUnavailableMessage,
} from "@/lib/site";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/FinalCta";
import { MEDIA } from "@/lib/media";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — parler à un expert | ${SITE.name}` },
      {
        name: "description",
        content: `Échangez avec ${SITE.name} sur votre installation d'extraction à ${zonesLine(" ou ")} : devis, question technique, zone d'intervention.`,
      },
      { property: "og:title", content: `Contact — ${SITE.name}` },
      {
        property: "og:description",
        content: "Parlez à un expert de l'entretien des systèmes d'extraction.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const wa = whatsappLink();
  const tel = phoneHref();
  const mail = emailHref();

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Parler à un expert"
        description="Le plus rapide reste la demande de devis : elle nous donne les éléments nécessaires pour vous répondre précisément."
        image={MEDIA.heroKitchen}
        imageAlt="Cuisine professionnelle"
        compact
      />

      <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <FileText className="size-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Demande de devis</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cinq étapes, environ deux minutes. Réponse après qualification.
            </p>
            <Button asChild className="mt-5">
              <Link to="/devis">Obtenir mon devis</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
            <MessageCircle className="size-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">WhatsApp</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Canal rapide pour une question courte.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                if (wa) {
                  track("WhatsApp Click", { from: "contact" });
                  window.open(wa, "_blank", "noopener");
                } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
              }}
            >
              Ouvrir WhatsApp
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7">
            <Phone className="size-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Téléphone</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {tel ? (
                <a href={tel} onClick={() => track("Phone Click")}>
                  {SITE.phone}
                </a>
              ) : (
                displayValue(SITE.phone, "Numéro à confirmer")
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7">
            <Mail className="size-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mail ? (
                <a href={mail}>{SITE.email}</a>
              ) : (
                displayValue(SITE.email, "Email à confirmer")
              )}
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-7">
          <h2 className="text-lg font-semibold tracking-tight">Zones d'intervention</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {activeZones().map((z) => (
              <li key={z.slug}>· {z.name}</li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-4 px-0">
            <Link to="/zones">Voir la carte</Link>
          </Button>
        </div>
      </div>

      <FinalCta
        title="Une question sur votre installation ?"
        subtitle="La demande de devis reste le chemin le plus court vers une réponse précise."
      />
    </div>
  );
}
