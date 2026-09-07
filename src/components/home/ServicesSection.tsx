import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/site";
import { SERVICE_ICONS } from "@/lib/ui-icons";

export function ServicesSection() {
  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Nos prestations"
            title="Ce que nous traitons"
            description="Chaque intervention porte sur les éléments réellement accessibles de votre installation."
          />
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.slug];
            if (!Icon) return null;
            return (
              <Reveal key={s.slug} delay={i * 60} className="bg-background">
                <ServiceCard icon={Icon} title={s.title} text={s.short} slug={s.slug} />
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="mt-10">
          <Button asChild variant="outline" size="lg" className="group h-12 rounded-sm px-6">
            <Link to="/services">
              Voir le détail des prestations
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
