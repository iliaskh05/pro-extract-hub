export type MethodStep = { n: string; title: string; text: string };

export const METHOD: MethodStep[] = [
  {
    n: "01",
    title: "Analyse",
    text: "Relevé de la configuration : hotte, filtres, conduit, moteur, accès et contraintes du site.",
  },
  {
    n: "02",
    title: "Préparation",
    text: "Protection des équipements et du poste de cuisson, consignation électrique lorsque nécessaire.",
  },
  {
    n: "03",
    title: "Dégraissage",
    text: "Traitement des éléments concernés avec des produits et méthodes adaptés aux supports.",
  },
  {
    n: "04",
    title: "Contrôle",
    text: "Vérification visuelle des zones traitées et remise en configuration de l'installation.",
  },
  {
    n: "05",
    title: "Documentation",
    text: "Photos avant / après et compte rendu des éléments traités et des points d'attention.",
  },
  {
    n: "06",
    title: "Suivi",
    text: "Proposition de la prochaine échéance et conservation de l'historique de votre installation.",
  },
];
