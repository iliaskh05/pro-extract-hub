import ductDetail from "@/assets/duct-detail.jpg";
import hoodReference from "@/assets/after-hood.jpg";
import motorReference from "@/assets/after-motor.jpg";

export type Sector = {
  slug: string;
  name: string;
  businessType: string;
  image: string;
  imagePosition: string;
  title: string;
  description: string;
  needs: string[];
  services: string[];
  constraints: string[];
  seoDescription: string;
};

export const SECTORS: Sector[] = [
  {
    slug: "restaurant",
    name: "Restaurants",
    businessType: "Restaurant",
    image: ductDetail,
    imagePosition: "center",
    title: "Dégraissage de hottes pour restaurants",
    description:
      "Les cuisines de restaurant sollicitent fortement les systèmes d'extraction. Nous qualifions votre installation avant toute intervention pour limiter l'impact sur le service.",
    needs: [
      "Entretien régulier de la hotte et des filtres",
      "Traitement des conduits accessibles",
      "Documentation après passage",
    ],
    services: [
      "degraissage-hotte",
      "nettoyage-filtres",
      "nettoyage-conduit",
      "entretien-periodique",
    ],
    constraints: [
      "Interventions planifiées hors service ou en créneau creux",
      "Accès parfois contraint en centre-ville",
    ],
    seoDescription:
      "Entretien des systèmes d'extraction pour restaurants : hotte, filtres, conduits. Qualification à distance et interventions planifiées.",
  },
  {
    slug: "hotel",
    name: "Hôtels",
    businessType: "Hôtel",
    image: ductDetail,
    imagePosition: "center",
    title: "Entretien des hottes en hôtellerie",
    description:
      "Petit-déjeuner, room-service, brasserie : les cuisines d'hôtel cumulent des usages variés. Nous adaptons le planning à votre activité.",
    needs: [
      "Continuité de service prioritaire",
      "Suivi des installations multi-points",
      "Historique des interventions",
    ],
    services: ["degraissage-hotte", "entretien-periodique", "diagnostic-devis"],
    constraints: [
      "Créneaux matinaux ou nocturnes selon configuration",
      "Coordination avec l'équipe cuisine",
    ],
    seoDescription:
      "Dégraissage et entretien des hottes pour hôtels : planification flexible, documentation et suivi.",
  },
  {
    slug: "fast-food",
    name: "Fast-foods",
    businessType: "Fast-food",
    image: hoodReference,
    imagePosition: "top",
    title: "Extraction en restauration rapide",
    description:
      "Cadence élevée, friture et cuissons continues : les installations s'encrassent vite. Nous qualifions l'état réel avant proposition.",
    needs: [
      "Interventions rapides et ciblées",
      "Fréquence d'entretien à définir selon l'activité",
      "Photos pour accélérer le devis",
    ],
    services: ["degraissage-hotte", "nettoyage-filtres", "nettoyage-conduit"],
    constraints: ["Fenêtres d'intervention courtes", "Urgences signalées sans délai garanti"],
    seoDescription:
      "Dégraissage de hottes pour fast-foods : qualification rapide, interventions planifiées selon vos horaires.",
  },
  {
    slug: "boulangerie",
    name: "Boulangeries",
    businessType: "Boulangerie",
    image: ductDetail,
    imagePosition: "right",
    title: "Hottes et fours en boulangerie",
    description:
      "Poussières de farine et graisses se combinent dans les conduits. Un relevé précis de l'installation guide notre proposition.",
    needs: [
      "Nettoyage des filtres et de la hotte",
      "Repérage des dépôts dans les conduits accessibles",
      "Entretien périodique possible",
    ],
    services: ["degraissage-hotte", "nettoyage-filtres", "entretien-periodique"],
    constraints: ["Intervention souvent avant l'ouverture", "Accès parfois étroit"],
    seoDescription:
      "Entretien des systèmes d'extraction en boulangerie : hotte, filtres et conduits accessibles.",
  },
  {
    slug: "patisserie",
    name: "Pâtisseries",
    businessType: "Pâtisserie",
    image: hoodReference,
    imagePosition: "bottom",
    title: "Extraction en pâtisserie",
    description:
      "Cuissons longues et productions variées sollicitent l'extraction. Nous documentons chaque intervention.",
    needs: [
      "Dégraissage des surfaces accessibles",
      "Contrôle visuel des filtres",
      "Compte rendu après passage",
    ],
    services: ["degraissage-hotte", "nettoyage-filtres", "diagnostic-devis"],
    constraints: ["Planification en dehors des pics de production"],
    seoDescription:
      "Dégraissage de hottes pour pâtisseries : intervention documentée et planifiée avec vous.",
  },
  {
    slug: "traiteur",
    name: "Traiteurs",
    businessType: "Traiteur",
    image: ductDetail,
    imagePosition: "left",
    title: "Cuisines de traiteur",
    description:
      "Production en volume, cuissons multiples : les systèmes d'extraction travaillent en continu. Nous qualifions l'installation complète.",
    needs: [
      "Hotte, filtres, conduit et moteur selon accessibilité",
      "Flexibilité sur les créneaux",
      "Contrats d'entretien possibles",
    ],
    services: [
      "degraissage-hotte",
      "nettoyage-conduit",
      "nettoyage-moteur-caisson",
      "entretien-periodique",
    ],
    constraints: ["Pics d'activité événementiels à anticiper"],
    seoDescription:
      "Entretien des hottes et conduits pour traiteurs : qualification complète et suivi.",
  },
  {
    slug: "cuisine-collective",
    name: "Cuisines collectives",
    businessType: "Cuisine collective",
    image: motorReference,
    imagePosition: "center",
    title: "Cuisines collectives et restauration de site",
    description:
      "Cantines, EHPAD, sites industriels : des volumes et des contraintes spécifiques. Nous adaptons la prestation à la configuration constatée.",
    needs: [
      "Interventions sur installations de taille variable",
      "Documentation pour le suivi interne",
      "Entretien périodique structuré",
    ],
    services: [
      "degraissage-hotte",
      "nettoyage-conduit",
      "entretien-periodique",
      "diagnostic-devis",
    ],
    constraints: ["Horaires imposés par l'activité du site", "Accès technique parfois complexe"],
    seoDescription:
      "Dégraissage de hottes pour cuisines collectives : planification, documentation et contrats d'entretien.",
  },
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}

export function sectorDevisSearch(sector: Sector) {
  return {
    business_type: sector.businessType,
    service: sector.slug,
    sector: sector.slug,
  };
}
