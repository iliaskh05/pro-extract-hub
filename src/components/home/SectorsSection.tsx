import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
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
  "cuisine-collective": Soup,
};

const HOME_SLUGS = ["restaurant", "hotel", "fast-food", "cuisine-collective"] as const;

/** Accueil : 4 secteurs max — le reste sur /secteurs. */
export function SectorsSection() {
  const featured = HOME_SLUGS.map((slug) => SECTORS.find((s) => s.slug === slug)).filter(
    Boolean,
  ) as typeof SECTORS;

  const [primary, ...rest] = featured;
  if (!primary) return null;

  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal>
          <SectionHeading
            eyebrow="Secteurs"
            title="Les établissements que nous accompagnons"
            description="Quelques profils représentatifs. La liste complète est sur la page secteurs."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectorCard
              sector={primary}
              icon={ICONS[primary.slug] ?? UtensilsCrossed}
              featured
              className="aspect-[4/3] lg:aspect-[16/11]"
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((s, i) => (
              <Reveal key={s.slug} delay={60 + i * 60}>
                <SectorCard
                  sector={s}
                  icon={ICONS[s.slug] ?? UtensilsCrossed}
                  className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[8.5rem]"
                />
              </Reveal>
            ))}
          </div>
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
