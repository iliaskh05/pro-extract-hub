import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ChefHat,
  Croissant,
  CakeSlice,
  Soup,
  UtensilsCrossed,
  Sandwich,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SectorCard } from "@/components/SectorCard";
import { Button } from "@/components/ui/button";
import { SECTORS } from "@/lib/sectors";

const ICONS: Record<string, LucideIcon> = {
  restaurant: UtensilsCrossed,
  hotel: Building2,
  "fast-food": Sandwich,
  boulangerie: Croissant,
  patisserie: CakeSlice,
  traiteur: ChefHat,
  "cuisine-collective": Soup,
};

export function SectorsSection() {
  const [feature, ...rest] = SECTORS;
  if (!feature) return null;

  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Secteurs"
            title="Les établissements que nous accompagnons"
            description="Chaque activité impose ses contraintes d'accès, d'horaires et de cadence. Nous adaptons l'intervention à la vôtre."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectorCard
              sector={feature}
              icon={ICONS[feature.slug] ?? UtensilsCrossed}
              featured
              className="aspect-[4/3] lg:aspect-[16/11]"
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
            {rest.slice(0, 2).map((s, i) => (
              <Reveal key={s.slug} delay={60 + i * 60}>
                <SectorCard
                  sector={s}
                  icon={ICONS[s.slug] ?? UtensilsCrossed}
                  className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[13rem]"
                />
              </Reveal>
            ))}
          </div>

          {rest.slice(2).map((s, i) => (
            <Reveal key={s.slug} delay={i * 60} className="lg:col-span-3">
              <SectorCard
                sector={s}
                icon={ICONS[s.slug] ?? UtensilsCrossed}
                className="aspect-[4/3] lg:aspect-[4/3]"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10">
          <Button asChild variant="outline" size="lg" className="group h-12 rounded-sm px-6">
            <Link to="/secteurs">
              Voir tous les secteurs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
