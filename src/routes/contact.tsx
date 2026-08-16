import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, FileText } from "lucide-react";
import { SITE, ZONES, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — parler à un expert extraction | Extraction Pro" },
      {
        name: "description",
        content:
          "Échangez avec notre équipe sur votre installation d'extraction : demande de devis, question technique, zone d'intervention.",
      },
      { property: "og:title", content: "Contact — Extraction Pro" },
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

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-24">
      <p className="eyebrow text-accent">Contact</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
        Parler à un expert
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Le plus rapide reste la demande de devis : elle nous donne les éléments nécessaires pour
        vous répondre précisément.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <FileText className="size-6 text-accent" />
          <h2 className="mt-4 text-lg font-bold tracking-tight">Demande de devis</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cinq étapes, environ deux minutes. Réponse après qualification.
          </p>
          <Button asChild className="mt-5">
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <MessageCircle className="size-6 text-accent" />
          <h2 className="mt-4 text-lg font-bold tracking-tight">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Canal rapide pour une question courte. Numéro WhatsApp Business à connecter.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              if (wa) window.open(wa, "_blank", "noopener");
              else
                toast.info("Prototype — WhatsApp non connecté", {
                  description: "Le numéro sera renseigné avant la mise en ligne.",
                });
            }}
          >
            Ouvrir WhatsApp
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <Phone className="size-6 text-accent" />
          <h2 className="mt-4 text-lg font-bold tracking-tight">Téléphone</h2>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.phonePlaceholder}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Placeholder prototype — à renseigner par la direction.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <Mail className="size-6 text-accent" />
          <h2 className="mt-4 text-lg font-bold tracking-tight">Email</h2>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.emailPlaceholder}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Placeholder prototype — à renseigner par la direction.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-7">
        <h2 className="text-lg font-bold tracking-tight">Zones d'intervention</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {ZONES.map((z) => (
            <li key={z.slug}>· {z.name}</li>
          ))}
        </ul>
        <Button asChild variant="ghost" className="mt-4 px-0">
          <Link to="/zones">Voir la carte</Link>
        </Button>
      </div>
    </div>
  );
}
