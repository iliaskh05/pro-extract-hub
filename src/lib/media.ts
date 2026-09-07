import heroKitchen from "@/assets/hero-kitchen.jpg";
import ductDetail from "@/assets/duct-detail.jpg";
import beforeHood from "@/assets/before-hood.jpg";
import afterHood from "@/assets/after-hood.jpg";
import beforeDuct from "@/assets/before-duct.jpg";
import afterDuct from "@/assets/after-duct.jpg";
import beforeMotor from "@/assets/before-motor.jpg";
import afterMotor from "@/assets/after-motor.jpg";

const hoodReference = afterHood;
const ductReference = ductDetail;
const motorReference = afterMotor;

/**
 * Visuels du site : uniquement des photos réelles présentes dans le dépôt.
 * Les paires avant / après utilisent les prises de vue correspondantes.
 */
export const MEDIA = {
  heroKitchen,
  ductDetail,
  hoodReference,
  ductReference,
  motorReference,
  beforeDuct,
  beforeHood,
  afterHood,
  afterDuct,
  beforeMotor,
  afterMotor,
} as const;

export type GalleryItem = {
  slug: string;
  title: string;
  type: string;
  before: string;
  after: string;
  objectPosition: string;
  beforeTreatment: "grime" | "clean";
  text: string;
};

export const GALLERY: GalleryItem[] = [
  {
    slug: "hotte",
    title: "Hotte de cuisine professionnelle",
    type: "Dégraissage de hotte et filtres",
    before: beforeHood,
    after: afterHood,
    objectPosition: "center 42%",
    beforeTreatment: "clean",
    text: "État encrassé constaté puis état après dégraissage des surfaces accessibles.",
  },
  {
    slug: "conduit",
    title: "Conduit d'extraction",
    type: "Nettoyage de conduit",
    before: beforeDuct,
    after: afterDuct,
    objectPosition: "center center",
    beforeTreatment: "clean",
    text: "Dépôts gras dans le conduit, puis état après traitement des zones accessibles.",
  },
  {
    slug: "moteur",
    title: "Moteur / caisson d'extraction",
    type: "Nettoyage moteur et caisson",
    before: beforeMotor,
    after: afterMotor,
    objectPosition: "center 38%",
    beforeTreatment: "clean",
    text: "Groupe moto-ventilateur : encrassement constaté, puis état après nettoyage hors tension.",
  },
];

export const SERVICE_VISUALS: Record<string, { image: string; caption: string; alt: string }> = {
  "degraissage-hotte": {
    image: hoodReference,
    caption: "Hotte et filtres — surfaces accessibles",
    alt: "Hotte professionnelle en inox — détail technique",
  },
  "nettoyage-filtres": {
    image: hoodReference,
    caption: "Filtres à labyrinthe — identification et entretien",
    alt: "Filtres de hotte professionnelle — détail technique",
  },
  "nettoyage-conduit": {
    image: ductReference,
    caption: "Conduit d'extraction — sections accessibles",
    alt: "Conduit d'extraction — détail technique",
  },
  "nettoyage-moteur-caisson": {
    image: motorReference,
    caption: "Groupe moto-ventilateur — hors tension",
    alt: "Moteur et caisson d'extraction — détail technique",
  },
  "entretien-periodique": {
    image: ductDetail,
    caption: "Calendrier d'entretien — historique conservé",
    alt: "Système d'extraction de cuisine professionnelle",
  },
  "diagnostic-devis": {
    image: ductDetail,
    caption: "Qualification de l'installation avant proposition",
    alt: "Détail technique d'un système d'extraction",
  },
};

export const SECTORS = [
  { name: "Restaurants", image: ductDetail, position: "center" },
  { name: "Hôtels", image: ductDetail, position: "center" },
  { name: "Fast-foods", image: hoodReference, position: "top" },
  { name: "Boulangeries", image: ductDetail, position: "right" },
  { name: "Pâtisseries", image: hoodReference, position: "bottom" },
  { name: "Traiteurs", image: ductDetail, position: "left" },
  { name: "Cuisines collectives", image: motorReference, position: "center" },
] as const;
