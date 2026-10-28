import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HoodVisualization } from "@/components/HoodVisualization";
import { BeforeAfterShowcase } from "@/components/home/BeforeAfterShowcase";
import { MethodSection } from "@/components/home/MethodSection";
import { HomeExploreTabs } from "@/components/home/HomeExploreTabs";
import { SectorsSection } from "@/components/home/SectorsSection";
import { GoogleReviewsSection } from "@/components/home/GoogleReviewsSection";
import { ComplianceBanner } from "@/components/home/ComplianceBanner";
import { FinalCta } from "@/components/FinalCta";
import { HAS_REAL_GOOGLE_REVIEWS } from "@/lib/google-reviews";

/**
 * Accueil aéré : preuves essentielles + détail dense en onglets.
 */
export function HomeStory() {
  return (
    <div className="relative z-10">
      <TrustStrip />
      <ServicesSection />
      <HoodVisualization />
      <BeforeAfterShowcase />
      <MethodSection />
      <HomeExploreTabs />
      <SectorsSection />
      {HAS_REAL_GOOGLE_REVIEWS ? <GoogleReviewsSection /> : null}
      <ComplianceBanner />
      <FinalCta />
    </div>
  );
}
