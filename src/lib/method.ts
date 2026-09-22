export type MethodStep = { n: string; title: string; text: string };

export const METHOD: MethodStep[] = [
  {
    n: "01",
    title: "Diagnostic",
    text: "Relevé de la configuration : hotte, filtres, conduit, moteur, accès et contraintes du site.",
  },
  {
    n: "02",
    title: "Protection",
    text: "Bâchage des équipements et du poste de cuisson, consignation électrique lorsque nécessaire.",
  },
  {
    n: "03",
    title: "Dégraissage",
    text: "Application d'une mousse active haute température sur les surfaces et supports concernés.",
  },
  {
    n: "04",
    title: "Rinçage",
    text: "Rinçage haute pression : élimination de la mousse et des résidus graisseux décollés.",
  },
  {
    n: "05",
    title: "Contrôle & attestation",
    text: "Vérification visuelle des zones traitées, photos et attestation de dégraissage remises.",
  },
  {
    n: "06",
    title: "Suivi",
    text: "Proposition de la prochaine échéance et conservation de l'historique de votre installation.",
  },
];
