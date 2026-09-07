import heroKitchen from "@/assets/hero-kitchen.jpg";
import ductDetail from "@/assets/duct-detail.jpg";
import afterHood from "@/assets/after-hood.jpg";
import afterMotor from "@/assets/after-motor.jpg";

/**
 * Une photo réelle par secteur — jamais la même image sur deux secteurs.
 * Les secteurs sans photo réelle disponible dans le dépôt restent volontairement
 * sans image : une vignette technique est affichée à la place.
 *
 * Emplacements réservés pour les vraies photos à venir :
 *   src/assets/sectors/sector-hotellerie.jpg
 *   src/assets/sectors/sector-boulangerie.jpg
 *   src/assets/sectors/sector-patisserie.jpg
 */
export const SECTOR_MEDIA: Record<string, { image: string; position: string } | undefined> = {
  restaurant: { image: heroKitchen, position: "center 45%" },
  "fast-food": { image: afterHood, position: "center 40%" },
  traiteur: { image: ductDetail, position: "center" },
  "cuisine-collective": { image: afterMotor, position: "center 38%" },
};
