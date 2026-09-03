/** Options du formulaire de devis — libellés affichés tels quels. */

export const NEED_TYPES = [
  { value: "devis_classique", label: "Devis classique" },
  { value: "intervention_urgente", label: "Intervention urgente" },
] as const;

export const URGENCY_LEVELS = [
  { value: "normal", label: "Normale", description: "Planification standard après qualification." },
  {
    value: "prioritaire",
    label: "Prioritaire",
    description: "Besoin à traiter en priorité — sans engagement de délai précis.",
  },
  {
    value: "critique",
    label: "Critique",
    description: "Situation bloquante ou à risque — traitement accéléré selon disponibilité.",
  },
] as const;

export const REQUEST_TYPES = [
  { value: "ponctuelle", label: "Intervention ponctuelle" },
  { value: "entretien_periodique", label: "Entretien périodique" },
  { value: "contrat", label: "Contrat d'entretien" },
] as const;

export const MAINTENANCE_FREQUENCIES = [
  { value: "mensuelle", label: "Mensuelle" },
  { value: "trimestrielle", label: "Trimestrielle" },
  { value: "semestrielle", label: "Semestrielle" },
  { value: "annuelle", label: "Annuelle" },
  { value: "a_determiner", label: "À déterminer" },
] as const;

export const INSTALLATION_TYPES = [
  "Hotte murale",
  "Hotte centrale / îlot",
  "Ligne de cuisson complète",
  "Autre / à préciser",
] as const;

export const HOOD_TYPES = [
  "Hotte avec filtres à labyrinthe",
  "Hotte avec filtres métalliques",
  "Hotte avec filtres combinés",
  "Non précisé",
] as const;

export const DUCT_LENGTHS = [
  "Moins de 3 m",
  "3 à 6 m",
  "6 à 12 m",
  "Plus de 12 m",
  "Non précisé",
] as const;

export const SOIL_LEVELS = [
  { value: "leger", label: "Léger" },
  { value: "modere", label: "Modéré" },
  { value: "important", label: "Important" },
  { value: "non_precise", label: "Non précisé" },
] as const;

export const ACCESSIBILITY_OPTIONS = [
  { value: "facile", label: "Accès facile" },
  { value: "echelle", label: "Échelle ou hauteur" },
  { value: "toiture", label: "Toiture / extérieur" },
  { value: "contraint", label: "Accès contraint" },
  { value: "non_precise", label: "Non précisé" },
] as const;

export const SCHEDULE_PREFERENCES = [
  "Matin avant ouverture",
  "Après fermeture",
  "Journée creuse",
  "Week-end",
  "À définir avec vous",
] as const;

export type NeedType = (typeof NEED_TYPES)[number]["value"];
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number]["value"];
export type RequestType = (typeof REQUEST_TYPES)[number]["value"];
export type MaintenanceFrequency = (typeof MAINTENANCE_FREQUENCIES)[number]["value"];

export function urgencyToPriority(level: UrgencyLevel | string): string {
  if (level === "critique") return "critical";
  if (level === "prioritaire") return "high";
  return "normal";
}

export function labelFor<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
): string {
  return (options.find((o) => o.value === value)?.label ?? value) || "—";
}
