import sectorRestaurant from "@/assets/real/hood-cookline.jpg";
import sectorHotel from "@/assets/real/kitchen-bw-service.jpg";
import sectorFastFood from "@/assets/real/grill-smoke.jpg";
import sectorBakery from "@/assets/real/bakery-ovens.jpg";
import sectorPastry from "@/assets/real/patisserie-case.jpg";
import sectorCaterer from "@/assets/real/catering-trays.jpg";
import sectorCollective from "@/assets/real/cafeteria-line.jpg";

/**
 * Une image distincte par secteur — photographie documentaire réelle.
 */
export const SECTOR_MEDIA: Record<string, { image: string; position: string } | undefined> = {
  restaurant: { image: sectorRestaurant, position: "center 45%" },
  hotel: { image: sectorHotel, position: "center" },
  "fast-food": { image: sectorFastFood, position: "center 40%" },
  boulangerie: { image: sectorBakery, position: "center" },
  patisserie: { image: sectorPastry, position: "center" },
  traiteur: { image: sectorCaterer, position: "center" },
  "cuisine-collective": { image: sectorCollective, position: "center 38%" },
};
