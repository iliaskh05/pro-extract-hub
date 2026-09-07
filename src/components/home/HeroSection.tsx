import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEDIA } from "@/lib/media";
import { zonesHeroLine } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function HeroSection() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  /* Parallaxe très légère sur la seule image du hero. */
  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0, ${(p * 34).toFixed(1)}px, 0)`;
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
      className="relative overflow-hidden bg-background"
      aria-label="Dégraissage professionnel des systèmes d'extraction"
    >
      <div
        className="grid-fine pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-secondary/70 to-transparent"
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-12 pt-16 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 lg:pt-24 lg:pb-32">
        <div>
          <p className="hero-copy eyebrow text-accent" style={{ animationDelay: "0.1s" }}>
            Dégraissage professionnel
          </p>

          <h1 className="mt-6 max-w-[16ch] text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]">
            <span className="hero-line block" style={{ animationDelay: "0.24s" }}>
              La performance commence
            </span>
            <span
              className="hero-line block text-muted-foreground"
              style={{ animationDelay: "0.4s" }}
            >
              par une hotte propre.
            </span>
          </h1>

          <p
            className="hero-copy mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: "0.56s" }}
          >
            Hottes, filtres, conduits et moteurs d'extraction : un entretien technique, documenté
            et adapté à votre cuisine professionnelle.
          </p>

          <div
            className="hero-copy mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.68s" }}
          >
            <Button asChild size="lg" className="group h-12 rounded-sm px-7 text-base">
              <Link to="/devis">
                Demander un devis
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group h-12 rounded-sm px-7 text-base"
            >
              <Link to="/services">
                Découvrir nos prestations
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p
            className="hero-copy mt-10 text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
            style={{ animationDelay: "0.8s" }}
          >
            {zonesHeroLine()}
          </p>
        </div>

        <div ref={mediaRef} className="hero-copy will-change-transform" style={{ animationDelay: "0.5s" }}>
          <figure className="hero-media relative overflow-hidden rounded-sm border border-border">
            <img
              src={MEDIA.heroKitchen}
              alt="Hotte d'extraction en inox dans une cuisine professionnelle"
              width={1600}
              height={1104}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover lg:aspect-[3/4]"
            />
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b2433]/70 via-transparent to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5">
              <span className="text-[10px] tracking-[0.22em] text-white/80 uppercase">
                Hotte · Filtres · Conduit · Moteur
              </span>
              <span className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-white/80 uppercase">
                <span className="size-1.5 rounded-full bg-[#b9ddeb]" aria-hidden="true" />
                Sur site
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
