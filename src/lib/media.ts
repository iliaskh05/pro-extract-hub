import heroKitchen from "@/assets/duct-detail.jpg";
import ductDetail from "@/assets/duct-detail.jpg";
import hoodReference from "@/assets/after-hood.jpg";
import ductReference from "@/assets/duct-detail.jpg";
import motorReference from "@/assets/after-motor.jpg";
import beforeDuct from "@/assets/before-duct.jpg";
import beforeHood from "@/assets/hero-kitchen.jpg";
import afterHood from "@/assets/after-hood.jpg";
import afterMotor from "@/assets/after-motor.jpg";

/**
 * Visuels du site.
 * Les paires avant/après du slider utilisent la même prise de vue (même fichier)
 * avec un traitement « encrassement » côté avant, en attendant vos photos réelles
 * dans `public/interventions/{slug}/before.jpg` et `after.jpg`.
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
    before: hoodReference,
    after: hoodReference,
    objectPosition: "center 42%",
    beforeTreatment: "grime",
    text: "Comparaison sur la même prise de vue : état encrassé puis état après dégraissage des surfaces accessibles.",
  },
  {
    slug: "conduit",
    title: "Conduit d'extraction",
    type: "Nettoyage de conduit",
    before: ductReference,
    after: ductReference,
    objectPosition: "center center",
    beforeTreatment: "grime",
    text: "Même angle de vue : dépôts gras dans le conduit, puis état après traitement des zones accessibles.",
  },
  {
    slug: "moteur",
    title: "Moteur / caisson d'extraction",
    type: "Nettoyage moteur et caisson",
    before: motorReference,
    after: motorReference,
    objectPosition: "center 38%",
    beforeTreatment: "grime",
    text: "Vue identique du groupe moto-ventilateur : encrassement constaté, puis état après nettoyage hors tension.",
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
