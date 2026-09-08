import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarRange, ClipboardList, Siren } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { saveQuotePrefill } from "@/lib/quote-prefill";
import { cn } from "@/lib/utils";

const MODES = [
  {
    icon: ClipboardList,
    title: "Intervention à l'unité",
    text: "Vous décrivez l'installation, nous proposons une intervention ponctuelle après qualification.",
    need: "devis_classique" as const,
    request: undefined as string | undefined,
    highlight: false,
  },
  {
    icon: CalendarRange,
    title: "Entretien périodique",
    text: "Un rythme de passages à définir avec vous, avec historique et prochaine échéance.",
    need: "devis_classique" as const,
    request: "entretien_periodique",
    highlight: true,
  },
  {
    icon: Siren,
    title: "Besoin prioritaire",
    text: "Signalez une urgence dans le formulaire : nous qualifions la demande sans promettre de délai ferme.",
    need: "intervention_urgente" as const,
    request: undefined as string | undefined,
    highlight: false,
  },
] as const;

export function EngagementModes() {
  return (
    <section className="bg-secondary/30">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Collaboration"
            title="Trois façons de démarrer"
            description="Sans grille tarifaire affichée : chaque proposition part de votre configuration réelle."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {MODES.map((m, i) => (
            <Reveal key={m.title} delay={i * 90}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-sm border bg-background p-6 transition-transform duration-500 hover:-translate-y-1",
                  m.highlight ? "border-accent/50" : "border-border",
                )}
              >
                <m.icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {m.text}
                </p>
                <Link
                  to="/devis"
                  onClick={() =>
                    saveQuotePrefill({
                      landing_page: "/",
                      service_source: "engagement-modes",
                      need_type: m.need,
                      request_type: m.request,
                      message: `Je souhaite : ${m.title}.`,
                    })
                  }
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  Préparer mon devis
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
