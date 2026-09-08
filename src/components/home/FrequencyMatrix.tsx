import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const ROWS = [
  { type: "Restaurant / bistrot", tip: "2 à 3 passages / an selon l'intensité" },
  { type: "Brasserie / fort volume", tip: "Souvent 3 passages / an" },
  { type: "Pizzeria / friture intensive", tip: "3 à 4 passages / an fréquents" },
  { type: "Fast-food / kebab", tip: "Fréquence élevée, à caler sur l'activité" },
  { type: "Boulangerie / pâtisserie", tip: "1 à 2 passages / an selon configuration" },
  { type: "Hôtel / cuisine continue", tip: "Planning flexible, suivi documenté" },
  { type: "Cuisine collective", tip: "Rythme structuré selon le site" },
] as const;

export function FrequencyMatrix() {
  return (
    <section className="bg-background">
      <div className="shell section-y">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Fréquences"
            title="Selon l'activité de votre cuisine"
            description="Indications d'usage courant — pas une règle unique. La fréquence adaptée se précise après qualification de votre installation."
          />
          <Link
            to="/devis"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            Obtenir mon devis
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-10 overflow-hidden rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/60 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Type d'établissement</th>
                <th className="px-5 py-3 font-semibold">Repère de fréquence</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.type} className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                  <td className="px-5 py-3.5 font-medium">{row.type}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{row.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
