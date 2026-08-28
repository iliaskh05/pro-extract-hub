import { TrustStrip } from "@/components/home/TrustStrip";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ExtractionSignature } from "@/components/home/ExtractionSignature";
import { DocumentedSection } from "@/components/home/DocumentedSection";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { SectorsSection } from "@/components/home/SectorsSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { DigitalFirst } from "@/components/home/DigitalFirst";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCta } from "@/components/FinalCta";

/** Sections homepage sous le hero — chargées en différé pour alléger le premier paint. */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <ProblemSection />
      <ExtractionSignature />
      <DocumentedSection />
      <BeforeAfterSection />
      <ServicesExplorer />
      <SectorsSection />
      <ProcessTimeline />
      <DigitalFirst />
      <ZonesSection />
      <FaqPreview />
      <FinalCta />
    </div>
  );
}
