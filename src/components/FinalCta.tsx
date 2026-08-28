import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { whatsappLink, whatsappUnavailableMessage } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

export function FinalCta({
  title = "Votre cuisine mérite une extraction impeccable.",
  subtitle = "Décrivez-nous votre installation et obtenez une réponse adaptée.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const glowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const wa = whatsappLink();

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const section = sectionRef.current;
      const glow = glowRef.current;
      if (!section || !glow) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const p = 1 - (rect.top + rect.height / 2) / window.innerHeight;
      glow.style.transform = `translate3d(-50%, ${(p * 60).toFixed(1)}px, 0)`;
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
    <section ref={sectionRef} className="surface-ink relative overflow-hidden">
      <div className="grid-tech absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl will-change-transform"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8 lg:py-36">
        <Reveal>
          <h2 className="text-[2.25rem] leading-[1.03] font-semibold tracking-[-0.045em] text-ink-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-ink-muted">{subtitle}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="inverse" className="group h-12 px-8 text-base">
              <Link to="/devis">
                Obtenir mon devis
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-ink-border bg-transparent px-8 text-base text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              onClick={() => {
                if (wa) {
                  track("WhatsApp Click", { from: "cta" });
                  window.open(wa, "_blank", "noopener");
                } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
              }}
            >
              WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
