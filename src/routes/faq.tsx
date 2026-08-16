import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const FAQ = [
  {
    q: "Quels établissements pouvez-vous accompagner ?",
    a: "Restaurants, hôtels, fast-foods, boulangeries, pâtisseries, traiteurs et cuisines collectives : tout établissement alimentaire professionnel disposant d'un système d'extraction.",
  },
  {
    q: "Où intervenez-vous ?",
    a: "Sur deux pôles : Paris & Île-de-France, et Perpignan & Pyrénées-Orientales. Nous ne communiquons pas de couverture au-delà de ces zones ; en limite de secteur, nous confirmons la faisabilité avant toute proposition.",
  },
  {
    q: "Comment demander un devis ?",
    a: "Via le formulaire en ligne : cinq étapes courtes sur votre établissement, votre installation, votre localisation, vos photos éventuelles et vos coordonnées. Notre équipe qualifie ensuite votre demande.",
  },
  {
    q: "Quels éléments devons-nous fournir pour le devis ?",
    a: "Le type d'établissement, la longueur approximative de la hotte, le nombre de filtres, la présence d'un conduit et d'un moteur ou caisson, ainsi que la date approximative de la dernière intervention. Des photos accélèrent beaucoup la qualification.",
  },
  {
    q: "Pouvez-vous intervenir en dehors des heures d'ouverture ?",
    a: "Les interventions sont planifiées avec vous pour limiter l'impact sur le service. Les créneaux possibles sont confirmés lors de la qualification de votre demande.",
  },
  {
    q: "Comment se déroule une intervention ?",
    a: "Analyse de l'installation, protection des équipements, dégraissage des éléments concernés, contrôle, puis documentation photo et compte rendu.",
  },
  {
    q: "Fournissez-vous un rapport d'intervention ?",
    a: "Oui : photos avant / après et compte rendu des éléments traités, avec signalement des points d'attention constatés.",
  },
  {
    q: "À quelle fréquence faut-il prévoir un entretien ?",
    a: "La fréquence dépend de votre activité, de votre type de cuisson et de vos obligations propres (notamment vis-à-vis de votre assurance). Nous préférons en discuter avec vous plutôt que d'annoncer une règle générale ; cette réponse sera précisée avec la direction avant la mise en ligne.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Questions fréquentes sur le dégraissage de hotte | Extraction Pro" },
      {
        name: "description",
        content:
          "Établissements accompagnés, zones desservies, déroulé d'une intervention, rapport, fréquence d'entretien : les réponses aux questions les plus fréquentes.",
      },
      { property: "og:title", content: "FAQ — Extraction Pro" },
      {
        property: "og:description",
        content: "Les réponses aux questions fréquentes sur l'entretien des systèmes d'extraction.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-24">
      <p className="eyebrow text-accent">FAQ</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
        Questions fréquentes
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        Sur les points réglementaires, nous restons volontairement prudents : ces réponses seront
        validées avec la direction avant la mise en ligne.
      </p>

      <Accordion type="single" collapsible className="mt-10">
        {FAQ.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger className="text-left text-base font-semibold">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-7 text-center">
        <p className="text-base font-semibold">Votre question n'est pas listée ?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/devis">Obtenir mon devis</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Parler à un expert</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
