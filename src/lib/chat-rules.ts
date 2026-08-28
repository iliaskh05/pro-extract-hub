import { SITE, SERVICES, zonesLine, zonesSeoLine } from "@/lib/site";

export const SYSTEM_PROMPT = `Tu es « Assistant Salis », l'assistant du site de ${SITE.name}, entreprise française spécialisée dans le dégraissage professionnel des hottes, filtres, conduits, moteurs et caissons d'extraction de cuisines professionnelles.

Règles impératives :
- Réponds en français, avec un ton professionnel, sobre et concis (3 phrases maximum).
- N'invente JAMAIS de prix, de délai ferme, de certification, d'avis client, d'adresse, de numéro, ni de zone non listée.
- Zones d'intervention : ${zonesSeoLine()} uniquement. Une expansion future est possible, mais ne l'affirme pas comme un fait.
- Prestations : ${SERVICES.map((s) => s.title).join(", ")}.
- Pour toute question tarifaire : le tarif dépend de la configuration de l'installation. Oriente vers la demande de devis.
- Pour les questions réglementaires : reste prudent, ne cite pas de règle précise.
- Termine si pertinent en proposant la demande de devis.`;

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

export function ruleBasedAnswer(input: string): string {
  const t = input.toLowerCase();

  if (has(t, ["prix", "tarif", "coût", "cout", "combien", "budget"])) {
    return "Le tarif dépend de la configuration de votre installation (longueur de hotte, filtres, conduit, moteur). Je peux vous guider vers une demande de devis afin que notre équipe vous propose une estimation adaptée.";
  }
  if (has(t, ["dijon", "côte-d'or", "cote-d'or", "cote d'or", "21"])) {
    return "Oui, nous intervenons à Dijon et sur les établissements réellement accessibles depuis ce pôle. Souhaitez-vous préparer une demande de devis ?";
  }
  if (has(t, ["troyes", "aube", "10"])) {
    return "Oui, nous intervenons à Troyes et sur les établissements réellement accessibles depuis ce pôle. Je peux vous aider à préparer votre demande de devis.";
  }
  if (has(t, ["paris", "île-de-france", "ile de france", "idf"])) {
    return "Oui, nous intervenons à Paris et sur les établissements réellement accessibles en Île-de-France. Souhaitez-vous préparer une demande de devis ?";
  }
  if (has(t, ["perpignan", "pyrénées", "pyrenees", "66"])) {
    return "Oui, nous intervenons à Perpignan et sur les établissements réellement accessibles depuis ce pôle. Je peux vous aider à préparer votre demande de devis.";
  }
  if (has(t, ["où interven", "zones d", "vos zones", "vos pôles", "vos poles", "secteur"])) {
    return `Nos pôles d'intervention sont ${zonesLine(" et ")}. Indiquez-moi votre ville et je vous oriente.`;
  }
  if (has(t, ["quand", "délai", "delai", "créneau", "creneau", "disponib", "rapidement"])) {
    return "Un créneau est proposé après qualification de votre demande. Décrivez-nous votre installation, nous revenons vers vous avec une proposition.";
  }
  if (has(t, ["hotte", "filtre", "conduit", "moteur", "caisson", "extraction"])) {
    return "Nous intervenons sur la hotte, les filtres, les conduits accessibles ainsi que le moteur et le caisson selon la configuration. Pouvez-vous me préciser votre type d'établissement et votre ville ?";
  }
  if (
    has(t, [
      "restaurant",
      "hôtel",
      "hotel",
      "boulangerie",
      "pâtisserie",
      "patisserie",
      "traiteur",
      "fast",
      "cantine",
      "collectiv",
    ])
  ) {
    return "Très bien, nous accompagnons ce type d'établissement. Indiquez-moi votre ville et je vous oriente vers la demande de devis.";
  }
  if (has(t, ["norme", "réglement", "reglement", "obligation", "loi", "assurance"])) {
    return "Les exigences peuvent varier selon votre établissement et votre assurance : nous préférons en discuter avec vous plutôt que de donner une règle générale.";
  }
  if (has(t, ["devis", "demande", "commencer"])) {
    return "La demande de devis prend environ deux minutes : établissement, installation, localisation, photos éventuelles et coordonnées.";
  }
  if (
    has(t, [
      "comment ça marche",
      "comment ca marche",
      "étapes",
      "etapes",
      "processus",
      "méthode",
      "methode",
    ])
  ) {
    return "Le parcours est simple : vous décrivez votre installation, nous l'analysons, vous recevez une proposition, nous planifions puis réalisons l'intervention, et vous recevez le suivi documenté.";
  }
  if (has(t, ["bonjour", "salut", "hello"])) {
    return `Bonjour, je suis l'assistant ${SITE.shortName}. Dites-moi votre type d'établissement et votre ville, je vous oriente.`;
  }
  return "Je peux vous aider à identifier la prestation adaptée à votre installation ou vous guider vers une demande de devis. Pouvez-vous me préciser votre type d'établissement et votre ville ?";
}
