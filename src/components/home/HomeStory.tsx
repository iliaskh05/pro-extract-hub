import { TrustStrip } from "@/components/home/TrustStrip";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { WhySalisSection } from "@/components/home/WhySalisSection";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { DocumentedSection } from "@/components/home/DocumentedSection";
import { SectorsSection } from "@/components/home/SectorsSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCta } from "@/components/FinalCta";

/** Sections homepage sous le hero — ordre conversion optimisé. */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <BeforeAfterSection />
      <WhySalisSection />
      <ServicesExplorer />
      <ProcessTimeline />
      <DocumentedSection />
      <SectorsSection />
      <ZonesSection />
      <FaqPreview />
      <FinalCta />
    </div>
  );
}
