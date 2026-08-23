import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/HeroSection";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dégraissage de hottes & conduits de cuisine pro | Extraction Pro" },
      {
        name: "description",
        content:
          "Dégraissage professionnel des hottes, filtres, conduits et moteurs d'extraction pour cuisines professionnelles. Paris & Île-de-France, Perpignan & Pyrénées-Orientales.",
      },
      { property: "og:title", content: "Une extraction impeccable. Une cuisine plus sereine." },
      {
        property: "og:description",
        content:
          "Dégraissage et entretien documenté des systèmes d'extraction de cuisines professionnelles.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative">
      <div
        id="hero-sentinel"
        className="pointer-events-none absolute top-0 h-[70svh] w-full"
        aria-hidden="true"
      />
      <HeroSection />

      {/* Le récit défile par-dessus le hero : la transition reste continue. */}
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
    </div>
  );
}
