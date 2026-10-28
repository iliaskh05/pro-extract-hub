import { SITE, SERVICES, zonesLine, zonesSeoLine } from "@/lib/site";

const SITE_KNOWLEDGE = `
Contenu officiel du site (seule source autorisée) :
- Entreprise : ${SITE.name} — ${SITE.tagline}.
- Téléphone : ${SITE.phone || "non publié"}.
- Adresse affichée : ${SITE.address || "non publiée"}.
- Pôles d'intervention : ${zonesSeoLine()}.
- Prestations :
${SERVICES.map((s) => `  • ${s.title} : ${s.short}`).join("\n")}
- Parcours client : description de l'installation → analyse → proposition → intervention planifiée → suivi documenté.
- Contact conversion : demande de devis sur /devis (environ 2 minutes) ou WhatsApp / téléphone si le prospect préfère.
`.trim();

export const SYSTEM_PROMPT = `Tu es « Assistant Salis », l'assistant conversationnel du site ${SITE.name}.

Mission unique : aider le visiteur à partir UNIQUEMENT des informations du site (ci-dessous). Tu n'es pas un assistant généraliste.

${SITE_KNOWLEDGE}

Règles impératives :
1. Réponds en français, ton professionnel, sobre, concis (3 phrases maximum).
2. N'utilise AUCUNE connaissance externe au site. Pas de culture générale, pas d'autres entreprises, pas d'actualité.
3. Si la question est hors sujet (météo, sport, politique, cuisine perso, autre métier, code, etc.) : refuse poliment en une phrase, puis recentre sur le dégraissage / devis.
4. Si l'info n'est pas dans le contenu officiel ci-dessus : dis clairement « Je n'ai pas cette information sur le site » et propose /devis ou un contact téléphonique/WhatsApp.
5. N'invente JAMAIS de prix, délai ferme, certification, avis client, SIRET, email, zone hors liste, ni engagement commercial.
6. Zones autorisées uniquement : ${zonesSeoLine()}. Pour une ville hors pôles : indique que la faisabilité doit être confirmée via devis, sans inventer une couverture.
7. Tarifs : toujours « dépend de la configuration » → oriente vers /devis.
8. Réglementation / normes / assurance : reste prudent, aucune règle précise inventée.
9. Si pertinent, termine en proposant la demande de devis.`;

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
  if (has(t, ["lyon", "rhône", "rhone", "69"])) {
    return "Oui, nous intervenons à Lyon et sur les établissements réellement accessibles depuis ce pôle. Je peux vous aider à préparer votre demande de devis.";
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
  if (
    has(t, [
      "météo",
      "meteo",
      "football",
      "politique",
      "président",
      "recette",
      "chatgpt",
      "openai",
      "code python",
      "javascript",
      "bitcoin",
      "crypto",
    ])
  ) {
    return `Je ne traite que les questions liées à ${SITE.shortName} (dégraissage, zones, devis). Souhaitez-vous préparer une demande de devis ?`;
  }
  return "Je m'appuie uniquement sur les informations du site. Précisez votre type d'établissement et votre ville, ou lancez une demande de devis — je vous oriente.";
}
