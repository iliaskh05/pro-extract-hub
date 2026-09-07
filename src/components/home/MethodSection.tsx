import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TimelineStep } from "@/components/TimelineStep";
import { Button } from "@/components/ui/button";
import { METHOD } from "@/lib/method";
import { METHOD_ICONS } from "@/lib/ui-icons";

export function MethodSection() {
  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Notre méthode"
            title="Une intervention maîtrisée, de l'analyse au contrôle final."
          />
        </Reveal>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {METHOD.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 70}>
              <TimelineStep
                n={step.n}
                title={step.title}
                text={step.text}
                icon={METHOD_ICONS[step.n]}
              />
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="mt-12">
          <Button asChild variant="outline" size="lg" className="group h-12 rounded-sm px-6">
            <Link to="/methode">
              Voir la méthode en détail
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
