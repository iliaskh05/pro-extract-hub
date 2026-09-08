import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarRange, Check, ClipboardList, MapPin, Siren } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FranceMap } from "@/components/FranceMap";
import { IleDeFranceMap } from "@/components/IleDeFranceMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDF_DEPARTMENTS } from "@/lib/idf-departments";
import { saveQuotePrefill } from "@/lib/quote-prefill";
import { activeZones, type ZoneSlug } from "@/lib/site";
import { cn } from "@/lib/utils";

const FREQ_ROWS = [
  {
    type: "Restaurant traditionnel / bistrot",
    usage: "2–3 fois / an",
    intensity: "Standard",
  },
  {
    type: "Brasserie (forte production)",
    usage: "3 fois / an",
    intensity: "Soutenu",
  },
  {
    type: "Pizzeria / four à bois",
    usage: "3–4 fois / an",
    intensity: "Soutenu",
  },
  {
    type: "Kebab / friterie",
    usage: "4 fois / an",
    intensity: "Intensif",
  },
  {
    type: "Restaurant asiatique (wok)",
    usage: "4–6 fois / an",
    intensity: "Très intensif",
  },
  {
    type: "Boulangerie / pâtisserie",
    usage: "1–2 fois / an",
    intensity: "Modéré",
  },
  {
    type: "Cantine / cuisine collective",
    usage: "2–3 fois / an",
    intensity: "Structuré",
  },
  {
    type: "EHPAD / clinique",
    usage: "2–3 fois / an",
    intensity: "Suivi",
  },
  {
    type: "Hôtel-restaurant",
    usage: "3–4 fois / an",
    intensity: "Continu",
  },
  {
    type: "Food truck / dark kitchen",
    usage: "3–4 fois / an",
    intensity: "Volume",
  },
] as const;

const MODES = [
  {
    icon: ClipboardList,
    title: "Intervention à l'unité",
    subtitle: "Sans engagement",
    points: [
      "Vous contactez quand le besoin apparaît",
      "Qualification de l'installation avant proposition",
      "Idéal pour démarrer la relation",
      "Pas de rythme imposé",
    ],
    need: "devis_classique" as const,
    request: undefined as string | undefined,
    highlight: false,
  },
  {
    icon: CalendarRange,
    title: "Entretien périodique",
    subtitle: "Suivi dans le temps",
    points: [
      "Passages planifiés selon votre activité",
      "Historique et prochaine échéance",
      "Priorité de traitement selon disponibilité",
      "Documentation conservée",
    ],
    need: "devis_classique" as const,
    request: "entretien_periodique",
    highlight: true,
  },
  {
    icon: Siren,
    title: "Besoin prioritaire",
    subtitle: "Quand c'est critique",
    points: [
      "Signalement via le formulaire devis",
      "Qualification rapide de la demande",
      "Aucun délai ferme annoncé à l'avance",
      "À anticiper dès que possible",
    ],
    need: "intervention_urgente" as const,
    request: undefined as string | undefined,
    highlight: false,
  },
] as const;

function FrequencyPanel() {
  return (
    <div className="step-in space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Repères d'usage selon le type de cuisine — pas une obligation unique. La fréquence adaptée
        se précise après qualification de votre installation.
      </p>

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="bg-ink text-ink-foreground">
              <th className="px-4 py-3.5 text-xs font-semibold tracking-[0.08em] uppercase">
                Type de cuisine
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold tracking-[0.08em] uppercase">
                Repère d'usage
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold tracking-[0.08em] uppercase">
                Intensité
              </th>
            </tr>
          </thead>
          <tbody>
            {FREQ_ROWS.map((row, i) => (
              <tr
                key={row.type}
                className={cn(
                  "border-t border-border transition-colors hover:bg-secondary/50",
                  i % 2 === 0 ? "bg-background" : "bg-secondary/25",
                )}
              >
                <td className="px-4 py-3 font-medium">{row.type}</td>
                <td className="px-4 py-3 font-semibold text-accent">{row.usage}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.intensity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="h-11 rounded-sm">
          <Link to="/devis">
            Obtenir mon devis
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Sans grille tarifaire affichée — devis adapté.
        </p>
      </div>
    </div>
  );
}

function ModesPanel() {
  return (
    <div className="step-in">
      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map((m) => (
          <article
            key={m.title}
            className={cn(
              "relative flex h-full flex-col rounded-sm border bg-background p-6 transition-transform duration-500 hover:-translate-y-1",
              m.highlight
                ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
                : "border-border",
            )}
          >
            {m.highlight && (
              <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
                Recommandé
              </span>
            )}
            <m.icon className="size-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{m.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{m.subtitle}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {m.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm leading-snug text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/devis"
              onClick={() =>
                saveQuotePrefill({
                  landing_page: "/",
                  service_source: "home-tabs-modes",
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
          </article>
        ))}
      </div>
    </div>
  );
}

function ZonesPanel() {
  const [hovered, setHovered] = useState<ZoneSlug | undefined>();
  const [view, setView] = useState<"idf" | "france">("idf");
  const zones = activeZones();
  const deptCodes = IDF_DEPARTMENTS.map((d) => d.code).join(" · ");

  return (
    <div className="step-in space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-lg font-semibold tracking-[-0.03em] sm:text-xl">
            Zones d'intervention
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Quatre pôles réellement desservis. Le pôle Paris détaille les{" "}
            <span className="font-medium text-foreground">8 départements d'Île-de-France</span>{" "}
            ({deptCodes}). En limite de secteur, la faisabilité est confirmée avant proposition.
          </p>
        </div>
        <div className="inline-flex rounded-sm border border-border bg-secondary/40 p-1">
          <button
            type="button"
            onClick={() => setView("idf")}
            className={cn(
              "rounded-sm px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors",
              view === "idf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Île-de-France
          </button>
          <button
            type="button"
            onClick={() => setView("france")}
            className={cn(
              "rounded-sm px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors",
              view === "france"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            France · 4 pôles
          </button>
        </div>
      </div>

      {view === "idf" ? (
        <div className="space-y-4">
          <IleDeFranceMap />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Schéma interactif : survolez un département pour afficher le détail. Couverture au
            plus près des sites accessibles — pas une annonce de chaque commune IDF.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ul className="divide-y divide-border rounded-sm border border-border bg-background">
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    to="/zones/$slug"
                    params={{ slug: z.slug }}
                    onMouseEnter={() => setHovered(z.slug)}
                    onMouseLeave={() => setHovered(undefined)}
                    onFocus={() => setHovered(z.slug)}
                    onBlur={() => setHovered(undefined)}
                    className={cn(
                      "group flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-secondary/60",
                      hovered === z.slug && "bg-secondary/60",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                        {z.name}
                      </span>
                      <span className="mt-0.5 block pl-5 text-xs text-muted-foreground">
                        {z.region}
                        {z.slug === "paris" ? ` · ${deptCodes}` : ""}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>

            <Button asChild variant="outline" className="mt-6">
              <Link to="/zones">
                Voir toutes les zones
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-sm border border-border bg-background p-3 sm:p-4">
            <FranceMap highlight={hovered} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Contenu dense (fréquences, modes, zones) — isolé en onglets pour garder l'accueil aéré. */
export function HomeExploreTabs() {
  return (
    <section className="border-y border-border bg-secondary/20">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="À retenir"
            title="Fréquences, modes et zones"
            description="Repères d'usage, modes de travail, et détail des zones — dont les départements d'Île-de-France."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <Tabs defaultValue="frequences" className="w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-sm bg-background p-1.5 sm:inline-flex sm:w-auto">
              <TabsTrigger
                value="frequences"
                className="rounded-sm px-4 py-2.5 data-[state=active]:shadow-none"
              >
                Fréquences
              </TabsTrigger>
              <TabsTrigger
                value="modes"
                className="rounded-sm px-4 py-2.5 data-[state=active]:shadow-none"
              >
                Modes de travail
              </TabsTrigger>
              <TabsTrigger
                value="zones"
                className="rounded-sm px-4 py-2.5 data-[state=active]:shadow-none"
              >
                Zones & IDF
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 rounded-sm border border-border bg-background p-5 sm:p-8">
              <TabsContent value="frequences" className="mt-0 outline-none">
                <FrequencyPanel />
              </TabsContent>
              <TabsContent value="modes" className="mt-0 outline-none">
                <ModesPanel />
              </TabsContent>
              <TabsContent value="zones" className="mt-0 outline-none">
                <ZonesPanel />
              </TabsContent>
            </div>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
