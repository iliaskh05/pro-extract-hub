import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BeforeAfterShowcase } from "@/components/home/BeforeAfterShowcase";
import { MethodSection } from "@/components/home/MethodSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FinalCta } from "@/components/FinalCta";

/**
 * Narration homepage : une section = une idée.
 * Preuve → prestations → résultat → méthode → zones → conversion.
 */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <ServicesSection />
      <BeforeAfterShowcase />
      <MethodSection />
      <ZonesSection />
      <FinalCta />
    </div>
  );
}
