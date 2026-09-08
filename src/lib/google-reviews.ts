/**
 * Avis Google — à brancher sur la fiche Google Business.
 *
 * 1. Renseignez VITE_GOOGLE_REVIEW_URL (lien « Écrire un avis » ou fiche GMB).
 * 2. Remplacez rating / reviewCount / reviews par les données réelles de la fiche.
 * Ne laissez pas de faux avis ou une note inventée en production.
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
  /** Relatif, ex. « il y a 2 mois » — recopié depuis Google. */
  relativeTime: string;
  /** 1 à 5 */
  rating: number;
  text: string;
};

export const GOOGLE_REVIEWS = {
  /** Lien fiche / écrire un avis — via .env ou collé ici temporairement. */
  writeReviewUrl: publicEnv("VITE_GOOGLE_REVIEW_URL"),
  /** URL publique de la fiche (optionnel, pour « voir tous les avis »). */
  profileUrl: publicEnv("VITE_GOOGLE_BUSINESS_URL"),
  businessName: "Salis3Hottes",
  /**
   * Note moyenne affichée — uniquement si réelle sur Google.
   * Laisser `null` tant que la fiche n'est pas reliée.
   */
  rating: null as number | null,
  /** Nombre d'avis — uniquement si réel. */
  reviewCount: null as number | null,
  /** Avis à coller depuis Google (vides = état « à brancher »). */
  reviews: [] as GoogleReview[],
};

export function googleReviewLink(): string | null {
  const url = GOOGLE_REVIEWS.writeReviewUrl || GOOGLE_REVIEWS.profileUrl;
  return url || null;
}
