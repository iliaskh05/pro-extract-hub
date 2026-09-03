import { TrustStrip } from "@/components/home/TrustStrip";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { ExtractionSignature } from "@/components/home/ExtractionSignature";
import { WhySalisSection } from "@/components/home/WhySalisSection";
import { DocumentedSection } from "@/components/home/DocumentedSection";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { DigitalFirst } from "@/components/home/DigitalFirst";
import { SectorsSection } from "@/components/home/SectorsSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCta } from "@/components/FinalCta";

/** Sections homepage sous le hero — ordre conversion + signature animée. */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <BeforeAfterSection />
      <ExtractionSignature />
      <WhySalisSection />
      <DocumentedSection />
      <ServicesExplorer />
      <ProcessTimeline />
      <DigitalFirst />
      <SectorsSection />
      <ZonesSection />
      <FaqPreview />
      <FinalCta />
    </div>
  );
}
