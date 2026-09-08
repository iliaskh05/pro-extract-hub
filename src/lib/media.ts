import heroKitchen from "@/assets/generated/hero-kitchen-extract.jpg";
import detailFilters from "@/assets/generated/detail-filters.jpg";
import serviceHood from "@/assets/generated/service-hood.jpg";
import serviceFilters from "@/assets/generated/service-filters.jpg";
import serviceDuct from "@/assets/generated/service-duct.jpg";
import serviceMotor from "@/assets/generated/service-motor.jpg";
import serviceMaintenance from "@/assets/generated/service-maintenance.jpg";
import serviceDiagnostic from "@/assets/generated/service-diagnostic.jpg";
import sectorRestaurant from "@/assets/generated/sector-restaurant.jpg";
import sectorHotel from "@/assets/generated/sector-hotel.jpg";
import sectorFastFood from "@/assets/generated/sector-fast-food.jpg";
import sectorBakery from "@/assets/generated/sector-bakery.jpg";
import sectorPastry from "@/assets/generated/sector-pastry.jpg";
import sectorCaterer from "@/assets/generated/sector-caterer.jpg";
import sectorCollective from "@/assets/generated/sector-collective.jpg";
import baHood from "@/assets/generated/ba-hood-clean.jpg";
import baDuct from "@/assets/generated/ba-duct-clean.jpg";
import baMotor from "@/assets/generated/ba-motor-clean.jpg";

/**
 * Visuels du site (série IA premium).
 * Avant/après : même angle + traitement `grime` = démonstration
 * jusqu'à `public/interventions/{slug}/before.jpg|after.jpg`.
 */
function interventionPair(slug: string, fallback: string) {
  void slug;
  return { before: fallback, after: fallback, demonstration: true as const };
}

export const MEDIA = {
  heroKitchen,
  detailFilters,
  ductDetail: serviceDuct,
  hoodReference: serviceHood,
  ductReference: serviceDuct,
  motorReference: serviceMotor,
  beforeHood: baHood,
  afterHood: baHood,
  beforeDuct: baDuct,
  afterDuct: baDuct,
  beforeMotor: baMotor,
  afterMotor: baMotor,
} as const;

export type GalleryItem = {
  slug: string;
  title: string;
  type: string;
  before: string;
  after: string;
  objectPosition: string;
  beforeTreatment: "grime" | "clean";
  demonstration: boolean;
  text: string;
};

const hoodPair = interventionPair("hotte", baHood);
const ductPair = interventionPair("conduit", baDuct);
const motorPair = interventionPair("moteur", baMotor);

export const GALLERY: GalleryItem[] = [
  {
    slug: "hotte",
    title: "Hotte de cuisine professionnelle",
    type: "Dégraissage de hotte et filtres",
    before: hoodPair.before,
    after: hoodPair.after,
    objectPosition: "center 42%",
    beforeTreatment: "grime",
    demonstration: hoodPair.demonstration,
    text: "Démonstration visuelle sur le même angle : état encrassé simulé, puis surface après dégraissage.",
  },
  {
    slug: "conduit",
    title: "Conduit d'extraction",
    type: "Nettoyage de conduit",
    before: ductPair.before,
    after: ductPair.after,
    objectPosition: "center center",
    beforeTreatment: "grime",
    demonstration: ductPair.demonstration,
    text: "Démonstration visuelle : dépôts gras illustrés, puis état après traitement des zones accessibles.",
  },
  {
    slug: "moteur",
    title: "Moteur / caisson d'extraction",
    type: "Nettoyage moteur et caisson",
    before: motorPair.before,
    after: motorPair.after,
    objectPosition: "center 38%",
    beforeTreatment: "grime",
    demonstration: motorPair.demonstration,
    text: "Démonstration visuelle du groupe moto-ventilateur : encrassement illustré, puis état après nettoyage.",
  },
];

export const SERVICE_VISUALS: Record<string, { image: string; caption: string; alt: string }> = {
  "degraissage-hotte": {
    image: serviceHood,
    caption: "Hotte et filtres — surfaces accessibles",
    alt: "Hotte professionnelle en inox après entretien",
  },
  "nettoyage-filtres": {
    image: serviceFilters,
    caption: "Filtres à labyrinthe — identification et entretien",
    alt: "Filtres de hotte professionnelle en inox",
  },
  "nettoyage-conduit": {
    image: serviceDuct,
    caption: "Conduit d'extraction — sections accessibles",
    alt: "Intérieur d'un conduit d'extraction métallique",
  },
  "nettoyage-moteur-caisson": {
    image: serviceMotor,
    caption: "Groupe moto-ventilateur — hors tension",
    alt: "Moteur et caisson d'extraction de cuisine professionnelle",
  },
  "entretien-periodique": {
    image: serviceMaintenance,
    caption: "Calendrier d'entretien — historique conservé",
    alt: "Organisation d'un suivi d'entretien d'extraction",
  },
  "diagnostic-devis": {
    image: serviceDiagnostic,
    caption: "Qualification de l'installation avant proposition",
    alt: "Inspection technique d'une hotte professionnelle",
  },
};

/** Visuels homepage secteurs (grille legacy). */
export const SECTORS = [
  { name: "Restaurants", slug: "restaurant", image: sectorRestaurant, position: "center" },
  { name: "Hôtels", slug: "hotel", image: sectorHotel, position: "center" },
  { name: "Fast-foods", slug: "fast-food", image: sectorFastFood, position: "top" },
  { name: "Boulangeries", slug: "boulangerie", image: sectorBakery, position: "right" },
  { name: "Pâtisseries", slug: "patisserie", image: sectorPastry, position: "bottom" },
  { name: "Traiteurs", slug: "traiteur", image: sectorCaterer, position: "left" },
  {
    name: "Cuisines collectives",
    slug: "cuisine-collective",
    image: sectorCollective,
    position: "center",
  },
] as const;
