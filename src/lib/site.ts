/**
 * Source unique des données publiques Salis 3 Hottes.
 * Les champs vides sont des placeholders officiels — ne pas inventer de valeurs.
 */

function publicEnv(key: string): string {
  try {
    const value = import.meta.env[key];
    return typeof value === "string" ? value.trim() : "";
  } catch {
    return "";
  }
}

export const SITE = {
  name: "Salis 3 Hottes",
  shortName: "Salis 3",
  legalName: "",
  legalForm: "",
  tagline: "Dégraissage & entretien des systèmes d'extraction",
  phone: "",
  email: "",
  address: "",
  siret: "",
  siren: "",
  vat: "",
  capital: "",
  director: "",
  hosting: "",
  hours: "",
  launch: "Début d'activité : septembre 2026",
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export const PENDING_COMPANY_INFO = [
  "Dénomination légale et forme juridique",
  "Adresse du siège",
  "SIRET / SIREN / TVA",
  "Téléphone professionnel",
  "Email professionnel",
  "Numéro WhatsApp Business",
  "Horaires de contact",
  "Hébergeur et directeur de publication",
  "Comptes sociaux",
  "Photos d'interventions réelles",
  "Précision du rayon d'intervention autour de Paris, Perpignan, Troyes et Dijon",
] as const;

/** WhatsApp — format international sans "+" ni espaces (ex. 33600000000). */
export const WHATSAPP_NUMBER = publicEnv("VITE_WHATSAPP_NUMBER");

export const WHATSAPP_DEFAULT_MESSAGE =
  "Bonjour, je souhaite un devis pour le dégraissage de mon système d'extraction.";

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappUnavailableMessage() {
  return {
    title: "WhatsApp bientôt disponible",
    description: "Le numéro WhatsApp Business sera publié dès qu'il sera confirmé.",
  };
}

export type Zone = {
  slug: string;
  name: string;
  region: string;
  short: string;
  description: string;
  active: boolean;
  heroTitle: string;
  localIntro: string;
  coverage: string;
  sectorsFocus: string;
  useful: string[];
  whatsappMessage: string;
  map: { x: number; y: number };
};

export const ZONES: Zone[] = [
  {
    slug: "paris",
    name: "Paris",
    region: "Île-de-France",
    short: "Paris",
    description:
      "Interventions sur Paris et les établissements professionnels réellement accessibles en Île-de-France.",
    active: true,
    heroTitle: "Dégraissage de hottes à Paris",
    localIntro:
      "Paris concentre une densité exceptionnelle de cuisines professionnelles : restaurants, hôtels, traiteurs et enseignes alimentaires. Nous intervenons sur les systèmes d'extraction après qualification de l'accès, des horaires et de la configuration technique.",
    coverage:
      "Le pôle parisien couvre Paris et les communes immédiatement accessibles en Île-de-France. En limite de secteur, la faisabilité est confirmée avant toute proposition.",
    sectorsFocus:
      "Restauration urbaine, hôtellerie, cuisine de collectivité et enseignes dont le service ne peut pas s'interrompre longtemps.",
    useful: [
      "Qualification à distance à partir de photos et d'un relevé simple",
      "Créneaux pensés pour limiter l'impact sur le service",
      "Documentation photo et compte rendu après passage",
    ],
    whatsappMessage: "Bonjour, je souhaite demander un devis pour mon établissement à Paris.",
    map: { x: 158, y: 92 },
  },
  {
    slug: "perpignan",
    name: "Perpignan",
    region: "Pyrénées-Orientales",
    short: "Perpignan",
    description:
      "Interventions sur Perpignan et les établissements professionnels réellement accessibles depuis ce pôle.",
    active: true,
    heroTitle: "Dégraissage de hottes à Perpignan",
    localIntro:
      "Perpignan et son bassin rassemblent restauration méditerranéenne, hôtellerie et commerces alimentaires. Nous traitons les installations d'extraction comme des équipements techniques, avec un relevé clair avant intervention.",
    coverage:
      "Le pôle de Perpignan couvre la ville et les communes immédiatement accessibles. Nous n'annonçons pas de couverture au-delà des zones réellement desservies.",
    sectorsFocus:
      "Restaurants, hôtels, brasseries et cuisines de collectivité exposés à une activité soutenue en saison.",
    useful: [
      "Relevé de hotte, filtres, conduit et moteur selon l'accessibilité",
      "Proposition adaptée à la configuration constatée",
      "Suivi et prochaine échéance conservés dans l'historique",
    ],
    whatsappMessage: "Bonjour, je souhaite demander un devis pour mon établissement à Perpignan.",
    map: { x: 178, y: 252 },
  },
  {
    slug: "troyes",
    name: "Troyes",
    region: "Aube",
    short: "Troyes",
    description:
      "Interventions sur Troyes et les établissements professionnels réellement accessibles depuis ce pôle.",
    active: true,
    heroTitle: "Dégraissage de hottes à Troyes",
    localIntro:
      "Troyes concentre restaurants, hôtels et commerces alimentaires dans un tissu urbain dense. Nous intervenons sur les installations d'extraction des cuisines professionnelles, après qualification de l'accès et de la configuration.",
    coverage:
      "Le pôle de Troyes couvre la ville et les communes immédiatement accessibles. En limite de secteur, la faisabilité est confirmée avant toute proposition.",
    sectorsFocus:
      "Cuisines de centre-ville, hôtels, brasseries et établissements alimentaires dont le service ne peut pas s'interrompre longtemps.",
    useful: [
      "Qualification à distance à partir de photos et d'un relevé simple",
      "Intervention planifiée selon vos horaires de service",
      "Documentation photo et compte rendu après passage",
    ],
    whatsappMessage: "Bonjour, je souhaite demander un devis pour mon établissement à Troyes.",
    map: { x: 176, y: 118 },
  },
  {
    slug: "dijon",
    name: "Dijon",
    region: "Côte-d'Or",
    short: "Dijon",
    description:
      "Interventions sur Dijon et les établissements professionnels réellement accessibles depuis ce pôle.",
    active: true,
    heroTitle: "Dégraissage de hottes à Dijon",
    localIntro:
      "Dijon rassemble une restauration exigeante, des hôtels et des cuisines de collectivité. Nous traitons les systèmes d'extraction comme des installations techniques, pas comme une surface à faire briller.",
    coverage:
      "Le pôle de Dijon couvre la ville et les communes immédiatement accessibles. Nous n'annonçons pas de couverture au-delà des zones réellement desservies.",
    sectorsFocus:
      "Gastronomie, hôtellerie, restauration rapide et cuisines collectives dont l'extraction travaille en continu.",
    useful: [
      "Relevé de hotte, filtres, conduit et moteur selon l'accessibilité",
      "Proposition adaptée à la configuration constatée",
      "Suivi et prochaine échéance conservés dans l'historique",
    ],
    whatsappMessage: "Bonjour, je souhaite demander un devis pour mon établissement à Dijon.",
    map: { x: 198, y: 148 },
  },
];

export type ZoneSlug = (typeof ZONES)[number]["slug"];

export function activeZones(): Zone[] {
  return ZONES.filter((z) => z.active);
}

export function getZone(slug: string): Zone | undefined {
  return ZONES.find((z) => z.slug === slug && z.active);
}

export function zonesLine(separator = " · "): string {
  const names = activeZones().map((z) => z.name);
  if (names.length === 0) return "";
  if (separator === " et " || separator === " ou ") {
    if (names.length === 1) return names[0]!;
    return `${names.slice(0, -1).join(", ")}${separator}${names[names.length - 1]!}`;
  }
  return names.join(separator);
}

export function zonesCountLabel(): string {
  const n = activeZones().length;
  const words = ["Aucun pôle", "Un pôle", "Deux pôles", "Trois pôles", "Quatre pôles"] as const;
  return words[n] ?? `${n} pôles`;
}

export function zonesSeoLine(): string {
  return activeZones()
    .map((z) => `${z.name} / ${z.region}`)
    .join(", ");
}

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
      "Dégraissage de la hotte de cuisine professionnelle : surfaces intérieures et extérieures accessibles, plénum, bacs de récupération et éléments associés, selon l'état et la configuration de l'installation.",
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
      "Entretien des conduits d'extraction sur les sections accessibles, avec repérage des trappes de visite et documentation de l'intervention. Les zones non accessibles sont signalées.",
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
      "Nettoyage du caisson d'extraction et du groupe moto-ventilateur lorsque la configuration et l'accessibilité le permettent, en sécurité et hors tension.",
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
      "Mise en place d'un calendrier d'entretien adapté à votre activité, après qualification, avec rappels et historique des interventions conservé.",
    points: [
      "Fréquence définie avec vous",
      "Rappels avant échéance",
      "Historique conservé",
      "Interventions hors service possibles selon planning",
    ],
  },
  {
    slug: "diagnostic-devis",
    title: "Diagnostic / devis",
    short: "Analyse de l'installation avant intervention lorsque nécessaire.",
    description:
      "Qualification de votre installation (hotte, filtres, conduit, moteur) afin de proposer une prestation réellement adaptée. Aucun engagement à ce stade.",
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

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export function displayValue(value: string, fallback: string) {
  return value.trim() ? value : fallback;
}

export function phoneHref() {
  const digits = SITE.phone.replace(/\s+/g, "");
  return digits ? `tel:${digits}` : null;
}

export function emailHref() {
  return SITE.email.trim() ? `mailto:${SITE.email}` : null;
}

export function siteUrl() {
  return publicEnv("VITE_SITE_URL").replace(/\/$/, "") || "";
}
