/**
 * Avis Google — UI + démos.
 * Remplacez par les vrais avis / note dès que la fiche GMB est reliée
 * (VITE_GOOGLE_REVIEW_URL + données ci-dessous).
 */

function publicEnv(key: string): string {
  try {
    const value = import.meta.env[key];
    return typeof value === "string" ? value.trim() : "";
  } catch {
    return "";
  }
}

export type GoogleReview = {
  id: string;
  author: string;
  /** Initiale affichée si pas d'avatar (1–2 caractères). */
  initial?: string;
  /** Relatif, ex. « il y a 2 mois ». */
  relativeTime: string;
  /** 1 à 5 */
  rating: number;
  text: string;
};

const DEMO_REVIEWS: GoogleReview[] = [
  {
    id: "r1",
    author: "Karim B.",
    initial: "K",
    relativeTime: "il y a 3 semaines",
    rating: 5,
    text: "Intervention propre et bien préparée. Hotte et filtres nickel, équipe discrète pendant le service. Je recommande.",
  },
  {
    id: "r2",
    author: "Sophie M.",
    initial: "S",
    relativeTime: "il y a 1 mois",
    rating: 5,
    text: "Devis clair, passage planifié hors rush. Le conduit était vraiment encrassé — résultat visible tout de suite.",
  },
  {
    id: "r3",
    author: "Yann D.",
    initial: "Y",
    relativeTime: "il y a 2 mois",
    rating: 5,
    text: "Pro et réactif. Photos avant/après fournies. On a enfin un suivi pour les prochaines échéances.",
  },
  {
    id: "r4",
    author: "Leïla R.",
    initial: "L",
    relativeTime: "il y a 2 mois",
    rating: 5,
    text: "Cuisine de collectivité : accès et horaires respectés. Travail soigné, rien à redire.",
  },
  {
    id: "r5",
    author: "Marc T.",
    initial: "M",
    relativeTime: "il y a 3 mois",
    rating: 5,
    text: "Bonne communication avant intervention. Filtres et caisson ressortis propres. On renouvelle.",
  },
];

export const GOOGLE_REVIEWS = {
  writeReviewUrl: publicEnv("VITE_GOOGLE_REVIEW_URL"),
  profileUrl: publicEnv("VITE_GOOGLE_BUSINESS_URL"),
  businessName: "Salis3Hottes",
  rating: 5.0,
  reviewCount: 5,
  reviews: DEMO_REVIEWS,
};

export function googleReviewLink(): string | null {
  const url = GOOGLE_REVIEWS.writeReviewUrl || GOOGLE_REVIEWS.profileUrl;
  return url || null;
}
