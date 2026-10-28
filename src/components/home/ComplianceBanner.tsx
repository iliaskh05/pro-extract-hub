import { AlertTriangle, FileCheck2, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CERT_ROWS = [
  { label: "Photos avant / après", value: "Incluses" },
  { label: "Zones traitées", value: "Détaillées" },
  { label: "Points d'attention", value: "Signalés" },
] as const;

/**
 * Rappel réglementaire prudent + preuve de documentation post-intervention.
 * L'ambre marque une rupture visuelle avec le bleu de confiance.
 */
export function ComplianceBanner() {
  return (
    <section className="surface-ink relative overflow-hidden" data-header-tone="dark">
      <div
        className="grid-tech pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />
      <div className="shell section-y relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="eyebrow flex items-center gap-2 text-signal">
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            Réglementation
          </p>
          <h2 className="mt-4 max-w-lg text-2xl leading-[1.08] font-semibold tracking-[-0.04em] text-ink-foreground sm:text-4xl">
            Une obligation légale, pas une option.
          </h2>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
            L'entretien périodique des systèmes d'extraction est attendu pour les cuisines
            professionnelles. Les exigences précises dépendent de votre établissement, de votre
            assureur et du contexte local : nous documentons l'intervention pour vous aider à
            conserver une trace claire.
          </p>
          <p className="mt-5 flex items-start gap-2.5 border-l-2 border-signal/50 py-1 pl-4 font-mono text-[0.8125rem] text-ink-foreground/85">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
            En cas de doute réglementaire, rapprochez-vous de votre assureur ou d'un conseil compétent.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto w-full max-w-sm rounded-sm border border-ink-border bg-ink-foreground text-ink shadow-lift">
            <div className="h-1 w-full bg-signal" aria-hidden="true" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow text-muted-foreground">Remis après intervention</p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
                    Compte rendu d'intervention
                  </h3>
                </div>
                <FileCheck2 className="size-6 shrink-0 text-signal" aria-hidden="true" />
              </div>

              <dl className="mt-6 space-y-4">
                {CERT_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className={
                      i > 0
                        ? "flex items-baseline justify-between gap-4 border-t border-border pt-4"
                        : "flex items-baseline justify-between gap-4"
                    }
                  >
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className="font-mono text-sm font-semibold tracking-tight">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 border-t border-dashed border-border pt-4 font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
                Document remis après chaque passage
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
