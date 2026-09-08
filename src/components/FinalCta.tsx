import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { MEDIA } from "@/lib/media";
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
  const mediaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const wa = whatsappLink();

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const section = sectionRef.current;
      const media = mediaRef.current;
      if (!section || !media) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const p = 1 - (rect.top + rect.height / 2) / window.innerHeight;
      media.style.transform = `scale(1.08) translate3d(0, ${(p * 40).toFixed(1)}px, 0)`;
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
      ref={sectionRef}
      className="relative overflow-hidden"
      data-header-tone="dark"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <img
          src={MEDIA.afterHood}
          alt=""
          loading="lazy"
          className="h-full w-full scale-110 object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#0a0c10]/78" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-accent/25 via-transparent to-transparent mix-blend-soft-light"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8 lg:py-36">
        <Reveal>
          <h2 className="font-display text-[2.25rem] leading-[1.03] font-bold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-white/65">{subtitle}</p>
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
              className="h-12 border-white/25 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
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
