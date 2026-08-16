export const SYSTEM_PROMPT = `Tu es « Assistant Extraction », l'assistant du site d'une entreprise française spécialisée dans le dégraissage professionnel des hottes, filtres, conduits, moteurs et caissons d'extraction de cuisines professionnelles.

Règles impératives :
- Réponds en français, avec un ton professionnel, sobre et concis (3 phrases maximum).
- N'invente JAMAIS de prix, de délai ferme, de certification, d'avis client, d'adresse ou de numéro.
- Zones d'intervention : Paris & Île-de-France, Perpignan & Pyrénées-Orientales uniquement.
- Pour toute question tarifaire : explique que le tarif dépend de la configuration de l'installation et oriente vers la demande de devis.
- Pour les questions réglementaires : reste prudent, ne cite pas de règle précise, invite à en discuter avec l'équipe.
- Termine si pertinent en proposant la demande de devis.`;

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

export function ruleBasedAnswer(input: string): string {
  const t = input.toLowerCase();

  if (has(t, ["prix", "tarif", "coût", "cout", "combien", "budget"])) {
    return "Le tarif dépend de la configuration de votre installation (longueur de hotte, filtres, conduit, moteur). Je peux vous guider vers une demande de devis afin que notre équipe vous propose une estimation adaptée.";
  }
  if (has(t, ["perpignan", "pyrénées", "pyrenees", "66"])) {
    return "Oui, notre pôle de Perpignan couvre Perpignan et les zones réellement desservies autour des Pyrénées-Orientales. Souhaitez-vous préparer une demande de devis ?";
  }
  if (has(t, ["paris", "île-de-france", "ile de france", "idf", "93", "92", "94"])) {
    return "Nous intervenons sur Paris et l'Île-de-France. Je peux vous aider à préparer votre demande de devis. Quel type d'établissement avez-vous ?";
  }
  if (has(t, ["quand", "délai", "delai", "créneau", "creneau", "disponib", "rapidement"])) {
    return "Notre équipe peut vous proposer un créneau après qualification de votre demande. Décrivez-nous votre installation et nous revenons vers vous avec une proposition.";
  }
  if (has(t, ["hotte", "filtre", "conduit", "moteur", "caisson", "extraction"])) {
    return "Nous intervenons sur la hotte, les filtres, les conduits accessibles ainsi que le moteur et le caisson selon la configuration. Pouvez-vous me préciser votre type d'établissement et votre ville ?";
  }
  if (has(t, ["restaurant", "hôtel", "hotel", "boulangerie", "pâtisserie", "patisserie", "traiteur", "fast", "cantine", "collectiv"])) {
    return "Très bien, nous accompagnons ce type d'établissement. Indiquez-moi votre ville et je vous oriente vers la demande de devis adaptée.";
  }
  if (has(t, ["norme", "réglement", "reglement", "obligation", "loi", "assurance"])) {
    return "Les exigences peuvent varier selon votre établissement et votre assurance : nous préférons en discuter avec vous plutôt que de donner une règle générale. Notre équipe peut vous accompagner sur ce point lors de la qualification.";
  }
  if (has(t, ["devis", "demande", "commencer"])) {
    return "Parfait. La demande de devis prend environ deux minutes : établissement, installation, localisation, photos éventuelles et coordonnées.";
  }
  if (has(t, ["bonjour", "salut", "hello"])) {
    return "Bonjour ! Dites-moi votre type d'établissement et votre ville, je vous oriente vers la prestation adaptée.";
  }
  return "Je peux vous aider à identifier la prestation adaptée à votre installation ou vous guider vers une demande de devis. Pouvez-vous me préciser votre type d'établissement et votre ville ?";
}
