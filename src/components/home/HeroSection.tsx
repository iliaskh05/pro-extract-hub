import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEDIA } from "@/lib/media";
import { SITE, zonesHeroLine } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Premier viewport : photo full-bleed, marque en signal héroïque,
 * une accroche, une CTA — pas de carte photo inset.
 */
export function HeroSection() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
      if (mediaRef.current) {
        mediaRef.current.style.transform = `scale(${(1 + p * 0.06).toFixed(4)}) translate3d(0, ${(p * 28).toFixed(1)}px, 0)`;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [reduced]);

  return (
    <section
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink lg:items-center"
      aria-label={`${SITE.name} — dégraissage professionnel`}
      data-header-tone="dark"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <img
          src={MEDIA.heroKitchen}
          alt=""
          width={1600}
          height={1104}
          fetchPriority="high"
          className="hero-kenburns h-full w-full object-cover object-[center_40%]"
          aria-hidden="true"
        />
      </div>

      {/* Fusion photo → texte */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0c10]/92 via-[#0a0c10]/55 to-[#0a0c10]/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0c10]/85 via-transparent to-[#0a0c10]/45"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-accent/20 to-transparent mix-blend-soft-light"
        aria-hidden="true"
      />

      <div className="shell relative w-full pt-28 pb-16 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <p
            className="hero-copy font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-bold tracking-[-0.04em] text-white"
            style={{ animationDelay: "0.08s" }}
          >
            {SITE.name}
          </p>

          <h1 className="mt-6 max-w-[14ch] text-[clamp(2.15rem,5.5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.045em] text-white">
            <span className="hero-line block" style={{ animationDelay: "0.22s" }}>
              La performance commence
            </span>
            <span
              className="hero-line block text-white/70"
              style={{ animationDelay: "0.38s" }}
            >
              par une hotte propre.
            </span>
          </h1>

          <p
            className="hero-copy mt-6 max-w-md text-base leading-relaxed text-white/72 md:text-lg"
            style={{ animationDelay: "0.52s" }}
          >
            Hottes, filtres, conduits et moteurs : entretien technique documenté pour les
            cuisines professionnelles.
          </p>

          <div className="hero-copy mt-9" style={{ animationDelay: "0.64s" }}>
            <Button
              asChild
              size="lg"
              variant="inverse"
              className="group h-12 px-8 text-base"
            >
              <Link to="/devis">
                Obtenir mon devis
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p
            className="hero-copy mt-10 text-[11px] tracking-[0.22em] text-white/45 uppercase"
            style={{ animationDelay: "0.76s" }}
          >
            {zonesHeroLine()}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
