import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { pageHead } from "@/lib/seo";
import { zonesLine } from "@/lib/site";
import { HeroSection } from "@/components/home/HeroSection";

const HomeStory = lazy(() =>
  import("@/components/home/HomeStory").then((m) => ({ default: m.HomeStory })),
);

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Dégraissage de hottes & conduits de cuisine pro | Salis 3 Hottes",
      description: `Dégraissage professionnel des hottes, filtres, conduits et moteurs d'extraction pour cuisines professionnelles. ${zonesLine(" et ")}.`,
      path: "/",
      ogTitle: "Une extraction impeccable. Une cuisine plus sereine.",
      ogDescription:
        "Dégraissage et entretien documenté des systèmes d'extraction de cuisines professionnelles.",
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
      <Suspense fallback={<div className="min-h-[40vh] bg-background" aria-hidden="true" />}>
        <HomeStory />
      </Suspense>
    </div>
  );
}
