import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { GALLERY } from "@/lib/media";

/** Une seule preuve visuelle, en grand : le résultat en un regard. */
export function BeforeAfterShowcase() {
  const featured = GALLERY[0]!;

  return (
    <section className="surface-ink relative overflow-hidden" data-header-tone="dark">
      <div className="grid-tech absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="shell section-y relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Avant / Après"
            title="Le résultat, en un regard."
            description="Une différence visible, mesurable et réalisée sur site."
          />
        </Reveal>

        <Reveal className="mt-12 lg:mt-16" variant="mask">
          <BeforeAfterSlider
            before={featured.before}
            after={featured.after}
            alt={featured.title}
            objectPosition={featured.objectPosition}
            beforeTreatment={featured.beforeTreatment}
            className="rounded-sm"
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-5 text-sm text-ink-muted">
            {featured.title} — {featured.type}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
