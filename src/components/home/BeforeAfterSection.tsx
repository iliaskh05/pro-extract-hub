import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Maximize2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { GALLERY } from "@/lib/media";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function BeforeAfterSection() {
  const [open, setOpen] = useState<number | null>(null);
  const featured = GALLERY[0]!;
  const selected = open !== null ? GALLERY[open] : null;

  return (
    <section className="surface-ink relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">Avant / Après</p>
            <h2 className="mt-4 max-w-xl text-3xl leading-[1.04] font-semibold tracking-[-0.04em] text-ink-foreground sm:text-5xl">
              Le résultat se constate, il ne se décrit pas
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            Exemples de démonstration réalisés pour ce prototype — il ne s'agit pas de chantiers
            clients réels.
          </p>
        </Reveal>

        <Reveal className="relative mt-12" variant="mask">
          <BeforeAfterSlider before={featured.before} after={featured.after} alt={featured.title} />
        </Reveal>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink-foreground"
          >
            <Maximize2 className="size-3.5" /> Ouvrir en grand
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal key={g.title} delay={i * 70}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="Voir"
                className="group cursor-swap w-full overflow-hidden rounded-2xl border border-ink-border bg-ink-soft text-left transition-transform duration-500 ease-out hover:-translate-y-1"
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <img
                    src={g.after}
                    alt={`${g.title} — après intervention (démonstration)`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-foreground uppercase">
                    Démonstration
                  </span>
                </span>
                <span className="block p-5">
                  <span className="block text-sm font-semibold tracking-tight text-ink-foreground">
                    {g.title}
                  </span>
                  <span className="mt-1 block text-xs text-ink-muted">{g.type}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-4xl">
          {selected && (
            <>
              <DialogTitle>{selected.title} — démonstration</DialogTitle>
              <DialogDescription>{selected.text}</DialogDescription>
              <BeforeAfterSlider
                before={selected.before}
                after={selected.after}
                alt={selected.title}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Type d'intervention : {selected.type}
                </p>
                <Link
                  to="/devis"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Obtenir un devis pour ce type d'installation
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
