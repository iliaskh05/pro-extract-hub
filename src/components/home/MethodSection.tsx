import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MethodTimeline } from "@/components/MethodTimeline";
import { Button } from "@/components/ui/button";

export function MethodSection() {
  return (
    <section className="surface-blue relative overflow-hidden border-y border-border">
      <div className="grid-blue pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="shell section-y relative">
        <Reveal>
          <SectionHeading
            eyebrow="Notre méthode"
            title="Une intervention maîtrisée, de l'analyse au contrôle final."
            description="Six étapes identiques à chaque passage : rien n'est laissé à l'improvisation."
          />
        </Reveal>

        <div className="mt-12 lg:mt-16">
          <MethodTimeline />
        </div>

        <Reveal delay={120} className="mt-12">
          <Button asChild variant="outline" size="lg" className="group h-12 rounded-sm bg-background px-6">
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
