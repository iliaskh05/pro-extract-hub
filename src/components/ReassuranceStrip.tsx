import { FileText, Camera, Clock, History, Calendar } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const ITEMS = [
  {
    icon: Camera,
    title: "Documentation photo",
    text: "Photos avant et après des éléments traités, conservées dans le compte rendu.",
  },
  {
    icon: FileText,
    title: "Compte rendu",
    text: "Synthèse des zones traitées et des points d'attention constatés.",
  },
  {
    icon: History,
    title: "Traçabilité",
    text: "Historique des interventions pour suivre l'évolution de votre installation.",
  },
  {
    icon: Clock,
    title: "Horaires flexibles",
    text: "Créneaux planifiés avec vous pour limiter l'impact sur le service.",
  },
  {
    icon: Calendar,
    title: "Suivi et échéances",
    text: "Prochaine intervention planifiable pour les contrats d'entretien.",
  },
] as const;

export function ReassuranceStrip() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <Reveal className="text-center">
          <p className="eyebrow text-accent">Réassurance</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Un suivi structuré, sans promesses excessives
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 50}>
              <div className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-accent">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
