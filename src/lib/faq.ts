import { zonesLine } from "@/lib/site";

export type FaqCategory =
  | "Prix"
  | "Intervention"
  | "Technique"
  | "Sécurité"
  | "Réglementation"
  | "Durée"
  | "Urgence"
  | "Entretien"
  | "Après intervention"
  | "Général";

export type FaqEntry = { q: string; a: string; category: FaqCategory };

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Général",
  "Prix",
  "Intervention",
  "Technique",
  "Sécurité",
  "Réglementation",
  "Durée",
  "Urgence",
  "Entretien",
  "Après intervention",
];

export const FAQ: FaqEntry[] = [
  {
    category: "Général",
    q: "Quels établissements pouvez-vous accompagner ?",
    a: "Restaurants, hôtels, fast-foods, boulangeries, pâtisseries, traiteurs et cuisines collectives : tout établissement alimentaire professionnel disposant d'un système d'extraction.",
  },
  {
    category: "Général",
    q: "Où intervenez-vous ?",
    a: `Nous intervenons depuis ${zonesLine(" et ")}. Nous ne communiquons pas de couverture au-delà de ces pôles ; en limite de secteur, nous confirmons la faisabilité avant toute proposition.`,
  },
  {
    category: "Prix",
    q: "Comment est calculé le prix d'une intervention ?",
    a: "Le tarif dépend de la dimension de la hotte, de la longueur des conduits, de la présence d'un moteur ou caisson, du nombre de filtres, de l'accessibilité, du niveau d'encrassement et du type d'établissement. Chaque demande fait l'objet d'une qualification avant proposition.",
  },
  {
    category: "Prix",
    q: "Proposez-vous des forfaits ou contrats ?",
    a: "Des entretiens périodiques et des contrats sont envisageables après qualification de votre installation et de votre rythme d'activité. Aucun tarif forfaitaire n'est affiché sans analyse préalable.",
  },
  {
    category: "Intervention",
    q: "Comment demander un devis ?",
    a: "Via le formulaire en ligne en six étapes : établissement, installation, besoin, photos, coordonnées et résumé. Notre équipe qualifie ensuite votre demande.",
  },
  {
    category: "Intervention",
    q: "Quels éléments devons-nous fournir pour le devis ?",
    a: "Le type d'établissement, la configuration de la hotte, le nombre de filtres, la présence d'un conduit et d'un moteur, le niveau d'encrassement estimé et la date approximative de la dernière intervention. Des photos accélèrent la qualification.",
  },
  {
    category: "Intervention",
    q: "Pouvez-vous intervenir en dehors des heures d'ouverture ?",
    a: "Les interventions sont planifiées avec vous pour limiter l'impact sur le service. Les créneaux possibles (matin, soir, week-end) sont confirmés lors de la qualification.",
  },
  {
    category: "Technique",
    q: "Comment se déroule une intervention ?",
    a: "Diagnostic, protection, démontage des éléments accessibles, dégraissage, nettoyage des composants, rinçage, remontage, contrôle final puis documentation.",
  },
  {
    category: "Technique",
    q: "Traitez-vous le moteur et le conduit ?",
    a: "Oui, lorsque la configuration et l'accessibilité le permettent. Les zones non accessibles sont signalées dans le compte rendu.",
  },
  {
    category: "Sécurité",
    q: "Quelles précautions prenez-vous sur site ?",
    a: "Protection des équipements, consignation électrique lorsque nécessaire, et respect des consignes d'accès communiquées par l'établissement.",
  },
  {
    category: "Réglementation",
    q: "L'entretien de l'extraction est-il obligatoire ?",
    a: "Les obligations dépendent de votre activité, de votre assurance et du contexte réglementaire applicable. Nous ne prétendons pas à une expertise juridique : en cas de doute, rapprochez-vous de votre assureur ou d'un conseil compétent.",
  },
  {
    category: "Durée",
    q: "Combien de temps dure une intervention ?",
    a: "La durée varie selon la taille de l'installation, le niveau d'encrassement et les éléments à traiter. Une estimation est communiquée après qualification, sans engagement ferme avant visite si nécessaire.",
  },
  {
    category: "Urgence",
    q: "Pouvez-vous traiter une demande urgente ?",
    a: "Vous pouvez signaler une urgence dans le formulaire. Nous traitons ces demandes en priorité selon nos disponibilités, sans garantir de délai d'intervention précis à ce stade.",
  },
  {
    category: "Entretien",
    q: "À quelle fréquence prévoir un entretien ?",
    a: "La fréquence dépend de votre activité, de votre type de cuisson et de vos obligations propres. Nous proposons mensuel, trimestriel, semestriel ou annuel selon qualification — ou un calendrier à définir ensemble.",
  },
  {
    category: "Entretien",
    q: "Conservez-vous l'historique des interventions ?",
    a: "Oui : chaque passage est documenté et une prochaine échéance peut être planifiée pour les contrats d'entretien.",
  },
  {
    category: "Après intervention",
    q: "Fournissez-vous un rapport d'intervention ?",
    a: "Oui : photos avant / après et compte rendu des éléments traités, avec signalement des points d'attention constatés.",
  },
  {
    category: "Après intervention",
    q: "Que faire si un élément nécessite une attention particulière ?",
    a: "Les points constatés sont mentionnés dans le compte rendu. Nous pouvons vous orienter vers une action corrective si elle relève de notre périmètre.",
  },
];
