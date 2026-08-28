import heroKitchen from "@/assets/hero-kitchen.jpg";
import beforeHood from "@/assets/before-hood.jpg";
import afterHood from "@/assets/after-hood.jpg";
import beforeDuct from "@/assets/before-duct.jpg";
import afterDuct from "@/assets/after-duct.jpg";
import beforeMotor from "@/assets/before-motor.jpg";
import afterMotor from "@/assets/after-motor.jpg";
import ductDetail from "@/assets/duct-detail.jpg";

export const MEDIA = {
  heroKitchen,
  beforeHood,
  afterHood,
  beforeDuct,
  afterDuct,
  beforeMotor,
  afterMotor,
  ductDetail,
} as const;

export const SERVICE_VISUALS: Record<string, { image: string; caption: string; alt: string }> = {
  "degraissage-hotte": {
    image: afterHood,
    caption: "Hotte et filtres — surfaces accessibles",
    alt: "Hotte professionnelle en inox après dégraissage (démonstration)",
  },
  "nettoyage-filtres": {
    image: beforeHood,
    caption: "Filtres à labyrinthe — identification et entretien",
    alt: "Filtres de hotte professionnelle (démonstration)",
  },
  "nettoyage-conduit": {
    image: afterDuct,
    caption: "Conduit d'extraction — sections accessibles",
    alt: "Conduit d'extraction après traitement (démonstration)",
  },
  "nettoyage-moteur-caisson": {
    image: afterMotor,
    caption: "Groupe moto-ventilateur — hors tension",
    alt: "Moteur et caisson d'extraction (démonstration)",
  },
  "entretien-periodique": {
    image: heroKitchen,
    caption: "Calendrier d'entretien — historique conservé",
    alt: "Cuisine professionnelle destinée à un suivi périodique",
  },
  "diagnostic-devis": {
    image: ductDetail,
    caption: "Qualification de l'installation avant proposition",
    alt: "Détail technique d'un système d'extraction",
  },
};

export const GALLERY = [
  {
    kind: "demonstration" as const,
    title: "Hotte de cuisine professionnelle",
    type: "Dégraissage de hotte et filtres",
    before: beforeHood,
    after: afterHood,
    text: "Démonstration : hotte et filtres fortement encrassés, puis état après dégraissage complet des surfaces accessibles.",
  },
  {
    kind: "demonstration" as const,
    title: "Conduit d'extraction",
    type: "Nettoyage de conduit",
    before: beforeDuct,
    after: afterDuct,
    text: "Démonstration : section de conduit chargée en dépôts gras, puis état après traitement des zones accessibles.",
  },
  {
    kind: "demonstration" as const,
    title: "Moteur / caisson d'extraction",
    type: "Nettoyage moteur et caisson",
    before: beforeMotor,
    after: afterMotor,
    text: "Démonstration : groupe moto-ventilateur encrassé, puis état après nettoyage hors tension.",
  },
] as const;

export const SECTORS = [
  { name: "Restaurants", image: heroKitchen, position: "center" },
  { name: "Hôtels", image: ductDetail, position: "center" },
  { name: "Fast-foods", image: afterHood, position: "top" },
  { name: "Boulangeries", image: heroKitchen, position: "right" },
  { name: "Pâtisseries", image: afterHood, position: "bottom" },
  { name: "Traiteurs", image: ductDetail, position: "left" },
  { name: "Cuisines collectives", image: afterMotor, position: "center" },
] as const;
