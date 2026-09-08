import sectorRestaurant from "@/assets/generated/sector-restaurant.jpg";
import sectorHotel from "@/assets/generated/sector-hotel.jpg";
import sectorFastFood from "@/assets/generated/sector-fast-food.jpg";
import sectorBakery from "@/assets/generated/sector-bakery.jpg";
import sectorPastry from "@/assets/generated/sector-pastry.jpg";
import sectorCaterer from "@/assets/generated/sector-caterer.jpg";
import sectorCollective from "@/assets/generated/sector-collective.jpg";

/**
 * Une image distincte par secteur (série IA premium).
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
