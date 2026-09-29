import kitchenWide from "@/assets/real/kitchen-wide.jpg";
import steelTexture from "@/assets/real/steel-texture.jpg";
import hoodCookline from "@/assets/real/hood-cookline.jpg";
import kitchenFan from "@/assets/real/kitchen-narrow-fan.jpg";
import kitchenService from "@/assets/real/kitchen-bw-service.jpg";
import grillSmoke from "@/assets/real/grill-smoke.jpg";
import bakeryOvens from "@/assets/real/bakery-ovens.jpg";
import patisserieCase from "@/assets/real/patisserie-case.jpg";
import cateringTrays from "@/assets/real/catering-trays.jpg";
import cafeteriaLine from "@/assets/real/cafeteria-line.jpg";
import filterCloggedWide from "@/assets/real/filter-clogged-wide.jpg";
import filterCleanWide from "@/assets/real/filter-clean-wide.jpg";
import filterCloggedMacro from "@/assets/real/filter-clogged-macro.jpg";
import filterCleanMacro from "@/assets/real/filter-clean-macro.jpg";

const heroKitchen = kitchenWide;
const detailFilters = steelTexture;
const serviceHood = hoodCookline;
const serviceFilters = steelTexture;
const serviceDuct = kitchenWide;
const serviceMotor = kitchenFan;
const serviceMaintenance = kitchenService;
const serviceDiagnostic = kitchenService;
const sectorRestaurant = hoodCookline;
const sectorHotel = kitchenService;
const sectorFastFood = grillSmoke;
const sectorBakery = bakeryOvens;
const sectorPastry = patisserieCase;
const sectorCaterer = cateringTrays;
const sectorCollective = cafeteriaLine;
const baDuct = kitchenWide;
const baMotor = kitchenFan;

/**
 * Visuels du site — photographie documentaire réelle.
 * Avant/après filtres : photos réelles d'un même filtre encrassé puis lavé
 * (Wikimedia Commons, CC BY-SA 4.0 — crédit affiché sous le comparateur).
 * Conduit / moteur : même angle + traitement `grime` = démonstration
 * jusqu'à `public/interventions/{slug}/before.jpg|after.jpg`.
 */
function interventionPair(slug: string, fallback: string) {
  void slug;
  return { before: fallback, after: fallback, demonstration: true as const };
}

const CC_FILTER_CREDIT = "Photo réelle — Wikimedia Commons, CC BY-SA 4.0";

export const MEDIA = {
  heroKitchen,
  detailFilters,
  ductDetail: serviceDuct,
  hoodReference: serviceHood,
  ductReference: serviceDuct,
  motorReference: serviceMotor,
  beforeHood: filterCloggedMacro,
  afterHood: filterCleanMacro,
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
  credit?: string;
};

const ductPair = interventionPair("conduit", baDuct);
const motorPair = interventionPair("moteur", baMotor);

export const GALLERY: GalleryItem[] = [
  {
    slug: "filtres",
    title: "Filtre à graisse de hotte professionnelle",
    type: "Dégraissage de filtres",
    before: filterCloggedWide,
    after: filterCleanWide,
    objectPosition: "center center",
    beforeTreatment: "clean",
    demonstration: false,
    text: "Photos réelles du même filtre : encrassé après des mois de cuisson, puis après dégraissage complet.",
    credit: CC_FILTER_CREDIT,
  },
  {
    slug: "filtres-macro",
    title: "Maille du filtre — vue rapprochée",
    type: "Filtre en gros plan",
    before: filterCloggedMacro,
    after: filterCleanMacro,
    objectPosition: "center center",
    beforeTreatment: "clean",
    demonstration: false,
    text: "Photos réelles au plus près de la maille : dépôts gras carbonisés, puis métal dégagé.",
    credit: CC_FILTER_CREDIT,
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
