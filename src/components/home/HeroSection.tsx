import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEDIA } from "@/lib/media";
import { whatsappLink, whatsappUnavailableMessage, zonesHeroLine } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

function transform(el: HTMLElement | null, x: number, y: number, scale = 1) {
  if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const wa = whatsappLink();

  useEffect(() => {
    if (reduced) return;

    // Le hero n'est collant qu'à partir de lg : ailleurs, ni sortie au scroll ni parallax.
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!desktop) return;
    const parallax = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let frame = 0;
    let mx = 0;
    let my = 0;
    let progress = 0;

    const paint = () => {
      frame = 0;
      sectionRef.current?.style.setProperty("--hero-p", progress.toFixed(3));
      transform(backdropRef.current, mx * 4, my * 3 + progress * 24);
      transform(mainRef.current, mx * 11, my * 8 + progress * 46, 1.02 + progress * 0.06);
      transform(detailRef.current, mx * -18, my * -13 + progress * 78);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onScroll = () => {
      progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      schedule();
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      schedule();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (parallax) window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  function openWhatsApp() {
    if (wa) {
      track("WhatsApp Click", { from: "hero" });
      window.open(wa, "_blank", "noopener");
    } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
  }

  return (
    <section
      ref={sectionRef}
      className="hero-bleed relative flex min-h-[100svh] flex-col overflow-hidden bg-ink lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-0"
      aria-label="Dégraissage et entretien des systèmes d'extraction"
    >
      <div ref={backdropRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="grid-tech absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 -left-24 h-[36rem] w-[36rem] rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div
        ref={mainRef}
        className="hero-media pointer-events-none absolute inset-[-5%] will-change-transform"
      >
        <img
          src={MEDIA.heroKitchen}
          alt="Hotte d'extraction en inox dans une cuisine professionnelle"
          width={1600}
          height={1104}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40 md:via-ink/80 md:to-ink/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60 md:via-transparent md:to-ink/55"
        aria-hidden="true"
      />

      <div className="hero-exit relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-24 pb-28 sm:px-5 sm:pt-28 sm:pb-24 md:pt-32 lg:px-8 lg:pt-36 lg:pb-24">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          {/* 1. Texte + CTAs */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="hero-copy eyebrow text-accent" style={{ animationDelay: "0.2s" }}>
              Dégraissage & entretien des systèmes d'extraction
            </p>

            <h1 className="mt-4 max-w-3xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.04em] text-ink-foreground sm:mt-5 sm:text-[2.25rem] sm:leading-[1.05] md:mt-6 md:text-5xl md:leading-[0.97] lg:text-[4.75rem]">
              <span className="hero-line block" style={{ animationDelay: "0.4s" }}>
                Une extraction impeccable.
              </span>
              <span
                className="hero-line mt-1 block text-ink-muted"
                style={{ animationDelay: "0.6s" }}
              >
                Une cuisine plus sereine.
              </span>
            </h1>

            <p
              className="hero-copy mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted sm:mt-6 sm:text-base md:text-lg"
              style={{ animationDelay: "0.8s" }}
            >
              Dégraissage professionnel des hottes, conduits, filtres et systèmes d'extraction pour
              les cuisines professionnelles.
            </p>

            <div
              className="hero-copy mt-6 flex w-full max-w-sm flex-col items-center gap-3 md:mt-8 md:max-w-none md:items-start md:gap-4"
              style={{ animationDelay: "0.9s" }}
            >
              <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-ink-border bg-ink-foreground/5 px-4 py-2.5 text-center text-[11px] font-medium text-ink-foreground/90 backdrop-blur-md sm:text-xs">
                <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span className="leading-snug">{zonesHeroLine()}</span>
              </p>

              <Button
                asChild
                size="lg"
                variant="inverse"
                className="group h-12 min-h-12 w-full px-6 text-base md:w-auto md:px-8"
              >
                <Link to="/devis">
                  Obtenir mon devis
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 min-h-12 w-full border-ink-border bg-transparent px-6 text-base text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground md:w-auto md:px-8"
              >
                <Link to="/contact">Parler à un expert</Link>
              </Button>

              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm text-ink-muted transition-colors hover:bg-ink-foreground/5 hover:text-ink-foreground md:w-auto md:px-2"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* 2. Image détail — empilée sous le texte sur mobile */}
          <div
            ref={detailRef}
            className="hero-copy will-change-transform"
            style={{ animationDelay: "1.1s" }}
          >
            <figure className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-ink-border shadow-lift rotate-[-1.5deg] sm:rotate-[-2deg] md:max-w-sm lg:ml-auto lg:rotate-0">
              <img
                src={MEDIA.ductDetail}
                alt="Détail métallique d'une hotte et d'un conduit d'extraction"
                width={1400}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-5 bottom-5 text-[10px] tracking-[0.2em] text-ink-foreground/80 uppercase">
                Inox · hotte · conduit
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <a
        href="#preuves"
        className="hero-exit hero-copy absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.28em] text-ink-muted uppercase transition-colors hover:text-ink-foreground lg:flex"
        style={{ animationDelay: "1.2s" }}
      >
        <span>Découvrir</span>
        <span className="scroll-pulse h-8 w-px bg-ink-foreground/50" aria-hidden="true" />
      </a>
    </section>
  );
}
