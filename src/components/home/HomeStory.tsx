import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HoodVisualization } from "@/components/HoodVisualization";
import { BeforeAfterShowcase } from "@/components/home/BeforeAfterShowcase";
import { MethodSection } from "@/components/home/MethodSection";
import { SectorsSection } from "@/components/home/SectorsSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FinalCta } from "@/components/FinalCta";

/**
 * Narration homepage — rythme visuel alterné :
 * blanc → bleu clair → blanc → bleu clair → blanc → bleu → sombre.
 */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <ServicesSection />
      <HoodVisualization />
      <BeforeAfterShowcase />
      <MethodSection />
      <SectorsSection />
      <ZonesSection />
      <FinalCta />
    </div>
  );
}
