import { TrustStrip } from "@/components/home/TrustStrip";
import { RiskFactsStrip } from "@/components/home/RiskFactsStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HoodVisualization } from "@/components/HoodVisualization";
import { BeforeAfterShowcase } from "@/components/home/BeforeAfterShowcase";
import { MethodSection } from "@/components/home/MethodSection";
import { EngagementModes } from "@/components/home/EngagementModes";
import { FrequencyMatrix } from "@/components/home/FrequencyMatrix";
import { SectorsSection } from "@/components/home/SectorsSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FinalCta } from "@/components/FinalCta";

/**
 * Narration homepage — rythme visuel + sections premium (faits, modes, fréquences).
 */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <RiskFactsStrip />
      <ServicesSection />
      <HoodVisualization />
      <BeforeAfterShowcase />
      <MethodSection />
      <EngagementModes />
      <FrequencyMatrix />
      <SectorsSection />
      <ZonesSection />
      <FinalCta />
    </div>
  );
}
