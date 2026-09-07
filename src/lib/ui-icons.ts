import {
  CalendarClock,
  Camera,
  ClipboardCheck,
  Cog,
  Droplets,
  Filter,
  Search,
  ShieldCheck,
  Waypoints,
  Wind,
  CircleCheckBig,
  type LucideIcon,
} from "lucide-react";

/** Icônes de prestations — une par slug réellement présent dans SERVICES. */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "degraissage-hotte": Wind,
  "nettoyage-filtres": Filter,
  "nettoyage-conduit": Waypoints,
  "nettoyage-moteur-caisson": Cog,
  "entretien-periodique": CalendarClock,
  "diagnostic-devis": ClipboardCheck,
};

/** Icônes des 6 étapes de la méthode, dans l'ordre de METHOD. */
export const METHOD_ICONS: Record<string, LucideIcon> = {
  "01": Search,
  "02": ShieldCheck,
  "03": Droplets,
  "04": CircleCheckBig,
  "05": Camera,
  "06": CalendarClock,
};
