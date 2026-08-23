import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEDIA } from "@/lib/media";
import { whatsappLink } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
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

  return (
    <section
      ref={sectionRef}
      className="hero-bleed relative flex min-h-[100svh] flex-col overflow-hidden bg-ink lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-0"
      aria-label="Dégraissage et entretien des systèmes d'extraction"
    >
      {/* Couche 1 — fond, mouvement le plus lent */}
      <div ref={backdropRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="grid-tech absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 -left-24 h-[36rem] w-[36rem] rounded-full bg-accent/8 blur-3xl" />
      </div>

      {/* Couche 2 — visuel principal */}
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
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/55"
        aria-hidden="true"
      />

      <div className="hero-exit relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-24 pb-16 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="hero-copy eyebrow text-accent" style={{ animationDelay: "0.2s" }}>
              Dégraissage & entretien des systèmes d'extraction
            </p>

            <h1 className="mt-5 max-w-3xl text-[2.25rem] leading-[1] font-semibold tracking-[-0.045em] text-ink-foreground sm:mt-6 sm:text-6xl sm:leading-[0.97] lg:text-[4.75rem]">
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
              className="hero-copy mt-6 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base md:text-lg"
              style={{ animationDelay: "0.8s" }}
            >
              Dégraissage professionnel des hottes, conduits, filtres et systèmes d'extraction pour
              les cuisines professionnelles.
            </p>

            <p
              className="hero-copy mt-6 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-foreground/5 px-4 py-2 text-xs font-medium text-ink-foreground/90 backdrop-blur-md"
              style={{ animationDelay: "0.9s" }}
            >
              <MapPin className="size-3.5 text-accent" />
              Paris & Île-de-France · Perpignan & Pyrénées-Orientales
            </p>

            <div
              className="hero-copy mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "1s" }}
            >
              <Button asChild size="lg" variant="inverse" className="group h-12 px-8 text-base">
                <Link to="/devis">
                  Obtenir mon devis
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-ink-border bg-transparent px-8 text-base text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/contact">Parler à un expert</Link>
              </Button>
              <button
                type="button"
                onClick={() => {
                  if (wa) window.open(wa, "_blank", "noopener");
                  else
                    toast.info("Prototype — WhatsApp non connecté", {
                      description:
                        "Le numéro WhatsApp Business sera renseigné avant la mise en ligne.",
                    });
                }}
                className="inline-flex h-12 items-center justify-center gap-2 px-2 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Couche 3 — détail de premier plan */}
          <div
            ref={detailRef}
            className="hero-copy hidden will-change-transform lg:block"
            style={{ animationDelay: "1.2s" }}
          >
            <figure className="relative ml-auto w-full max-w-sm overflow-hidden rounded-2xl border border-ink-border shadow-lift">
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
        <span>Scroll to explore</span>
        <span className="scroll-pulse h-8 w-px bg-ink-foreground/50" aria-hidden="true" />
      </a>
    </section>
  );
}
