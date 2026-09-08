import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HoodVisualization } from "@/components/HoodVisualization";
import { BeforeAfterShowcase } from "@/components/home/BeforeAfterShowcase";
import { MethodSection } from "@/components/home/MethodSection";
import { HomeExploreTabs } from "@/components/home/HomeExploreTabs";
import { SectorsSection } from "@/components/home/SectorsSection";
import { GoogleReviewsSection } from "@/components/home/GoogleReviewsSection";
import { FinalCta } from "@/components/FinalCta";

/**
 * Accueil aéré : preuves essentielles + détail dense en onglets.
 * Pas de prix inventés, pas de faux avis Google (section prête à brancher).
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
      <GoogleReviewsSection />
      <FinalCta />
    </div>
  );
}
