/**
 * Constantes du prototype.
 * Les coordonnées réelles ne sont pas inventées : ce sont des placeholders
 * à remplacer par la direction avant la mise en production.
 */

export const SITE = {
  name: "Extraction Pro",
  legalName: "Extraction Pro (dénomination provisoire — prototype)",
  tagline: "Dégraissage & entretien des systèmes d'extraction",
  // À remplacer par le numéro réel (format international, sans espaces)
  phonePlaceholder: "À définir",
  emailPlaceholder: "À définir",
  addressPlaceholder: "Adresse à définir",
  siretPlaceholder: "SIRET à définir",
  launch: "Début d'activité : septembre 2026",
} as const;

/**
 * WhatsApp — à connecter à WhatsApp Business Platform (Meta).
 * Renseigner WHATSAPP_NUMBER au format international sans "+" ni espaces
 * (ex. "33600000000") pour activer les liens wa.me.
 */
export const WHATSAPP_NUMBER = "" as string;
export const WHATSAPP_DEFAULT_MESSAGE =
  "Bonjour, je souhaite un devis pour le dégraissage de mon système d'extraction.";

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const ZONES = [
  {
    slug: "paris",
    name: "Paris & Île-de-France",
    short: "Paris / IDF",
    description:
      "Pôle Paris — interventions sur Paris et les communes d'Île-de-France réellement desservies.",
  },
  {
    slug: "perpignan",
    name: "Perpignan & Pyrénées-Orientales",
    short: "Perpignan / P.-O.",
    description:
      "Pôle Perpignan — interventions sur Perpignan et les zones réellement desservies des Pyrénées-Orientales.",
  },
] as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  points: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "degraissage-hotte",
    title: "Dégraissage de hotte",
    short: "Nettoyage professionnel de la hotte et des éléments associés.",
    description:
      "Dégraissage complet de la hotte de cuisine professionnelle : surfaces intérieures et extérieures, plénum, bacs de récupération et éléments accessibles associés.",
    points: [
      "Protection du poste de cuisson avant intervention",
      "Dégraissage des surfaces accessibles",
      "Contrôle visuel de l'état général",
      "Photos avant / après",
    ],
  },
  {
    slug: "nettoyage-filtres",
    title: "Nettoyage des filtres",
    short: "Entretien des filtres selon leur type et leur état.",
    description:
      "Dépose, nettoyage et repose des filtres (chocs, à labyrinthe, métalliques) selon leur typologie, leur état et les préconisations du fabricant.",
    points: [
      "Identification du type de filtres",
      "Nettoyage adapté au support",
      "Signalement des filtres à remplacer",
      "Repose et contrôle",
    ],
  },
  {
    slug: "nettoyage-conduit",
    title: "Nettoyage des conduits",
    short: "Entretien des conduits d'extraction.",
    description:
      "Entretien des conduits d'extraction sur les sections accessibles, avec repérage des trappes de visite et documentation de l'intervention.",
    points: [
      "Repérage des accès et trappes",
      "Traitement des sections accessibles",
      "Signalement des zones non accessibles",
      "Documentation photo",
    ],
  },
  {
    slug: "nettoyage-moteur-caisson",
    title: "Nettoyage moteur / caisson",
    short: "Selon la configuration de l'installation.",
    description:
      "Nettoyage du caisson d'extraction et du groupe moto-ventilateur lorsque la configuration de l'installation le permet, en sécurité et hors tension.",
    points: [
      "Consignation électrique préalable",
      "Nettoyage turbine et caisson accessibles",
      "Contrôle visuel de fonctionnement",
      "Compte rendu",
    ],
  },
  {
    slug: "entretien-periodique",
    title: "Entretien périodique",
    short: "Organisation d'interventions récurrentes.",
    description:
      "Mise en place d'un calendrier d'entretien adapté à votre activité, avec rappels et historique des interventions conservé.",
    points: [
      "Fréquence définie avec vous",
      "Rappels avant échéance",
      "Historique conservé",
      "Interventions hors service possible selon planning",
    ],
  },
  {
    slug: "diagnostic-devis",
    title: "Diagnostic / devis",
    short: "Analyse de l'installation avant intervention lorsque nécessaire.",
    description:
      "Qualification de votre installation (hotte, filtres, conduit, moteur) afin de proposer une prestation réellement adaptée et un devis cohérent.",
    points: [
      "Qualification à distance ou sur site",
      "Relevé des éléments techniques",
      "Proposition détaillée",
      "Aucun engagement",
    ],
  },
];

export const BUSINESS_TYPES = [
  "Restaurant",
  "Hôtel",
  "Fast-food",
  "Boulangerie",
  "Pâtisserie",
  "Cuisine collective",
  "Traiteur",
  "Autre",
] as const;

export const LEAD_STATUSES = [
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "qualified", label: "Qualifié" },
  { value: "quote_requested", label: "Devis demandé" },
  { value: "quote_sent", label: "Devis envoyé" },
  { value: "won", label: "Gagné" },
  { value: "lost", label: "Perdu" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];
