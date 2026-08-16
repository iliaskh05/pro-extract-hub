import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CalendarClock,
  ClipboardCheck,
  MapPin,
  MousePointerClick,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { FranceMap } from "@/components/FranceMap";
import { SERVICES, ZONES } from "@/lib/site";
import { METHOD } from "./methode";
import { FAQ } from "./faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import heroKitchen from "@/assets/hero-kitchen.jpg";
import beforeHood from "@/assets/before-hood.jpg";
import afterHood from "@/assets/after-hood.jpg";
import beforeDuct from "@/assets/before-duct.jpg";
import afterDuct from "@/assets/after-duct.jpg";
import beforeMotor from "@/assets/before-motor.jpg";
import afterMotor from "@/assets/after-motor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dégraissage de hottes & conduits de cuisine pro | Extraction Pro" },
      {
        name: "description",
        content:
          "Dégraissage professionnel des hottes, filtres, conduits et moteurs d'extraction pour cuisines professionnelles. Paris & Île-de-France, Perpignan & Pyrénées-Orientales.",
      },
      { property: "og:title", content: "Une extraction impeccable. Une cuisine plus sereine." },
      {
        property: "og:description",
        content:
          "Dégraissage et entretien documenté des systèmes d'extraction de cuisines professionnelles.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const TRUST = [
  { icon: Wrench, label: "Intervention professionnelle" },
  { icon: Camera, label: "Photos avant / après" },
  { icon: ClipboardCheck, label: "Rapport d'intervention" },
  { icon: CalendarClock, label: "Suivi périodique" },
  { icon: MapPin, label: "Paris & Perpignan" },
];

const WHY = [
  {
    icon: Wrench,
    title: "Expertise technique",
    text: "Compréhension du système d'extraction dans son ensemble : hotte, filtres, conduit, moteur.",
  },
  {
    icon: Camera,
    title: "Traçabilité",
    text: "Photos, détail de l'intervention et rapport transmis après chaque passage.",
  },
  {
    icon: MousePointerClick,
    title: "Simplicité",
    text: "Demande de devis en ligne, guidée, en quelques minutes.",
  },
  {
    icon: CalendarClock,
    title: "Suivi",
    text: "Possibilité de prévoir les prochaines interventions et de conserver l'historique.",
  },
];

const STEPS = [
  { n: "01", t: "Vous faites votre demande." },
  { n: "02", t: "Nous qualifions votre installation." },
  { n: "03", t: "Vous recevez votre proposition." },
  { n: "04", t: "Nous planifions l'intervention." },
  { n: "05", t: "Vous recevez les éléments de suivi." },
];

const GALLERY = [
  {
    title: "Hotte de cuisine professionnelle",
    type: "Dégraissage de hotte et filtres",
    before: beforeHood,
    after: afterHood,
    text: "Démonstration : hotte et filtres fortement encrassés, puis état après dégraissage complet des surfaces accessibles.",
  },
  {
    title: "Conduit d'extraction",
    type: "Nettoyage de conduit",
    before: beforeDuct,
    after: afterDuct,
    text: "Démonstration : section de conduit chargée en dépôts gras, puis état après traitement des zones accessibles.",
  },
  {
    title: "Moteur / caisson d'extraction",
    type: "Nettoyage moteur et caisson",
    before: beforeMotor,
    after: afterMotor,
    text: "Démonstration : groupe moto-ventilateur encrassé, puis état après nettoyage hors tension.",
  },
];

const AUDIENCES = [
  "Restaurants",
  "Hôtels",
  "Fast-foods",
  "Boulangeries",
  "Pâtisseries",
  "Traiteurs",
  "Cuisines collectives",
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="surface-ink relative overflow-hidden">
        <img
          src={heroKitchen}
          alt="Hotte d'extraction en inox dans une cuisine professionnelle"
          width={1600}
          height={1104}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/40"
          aria-hidden="true"
        />
        <div className="grid-tech absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-16 lg:px-8 lg:pt-32 lg:pb-28">
          <p className="eyebrow text-accent">Dégraissage & entretien des systèmes d'extraction</p>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.03] font-extrabold tracking-tight text-ink-foreground sm:text-6xl lg:text-7xl">
            Une extraction impeccable.
            <span className="block text-ink-muted">Une cuisine plus sereine.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            Dégraissage professionnel des hottes, conduits, filtres et systèmes d'extraction pour
            les cuisines professionnelles.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-foreground/5 px-4 py-2 text-xs font-medium text-ink-foreground backdrop-blur">
            <MapPin className="size-3.5 text-accent" />
            Paris & Île-de-France · Perpignan & Pyrénées-Orientales
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 px-8 text-base">
              <Link to="/devis">
                Obtenir mon devis <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 border-ink-border bg-transparent px-8 text-base text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <Link to="/contact">Parler à un expert</Link>
            </Button>
          </div>
        </div>

        {/* BARRE DE CONFIANCE */}
        <div className="relative border-t border-ink-border bg-ink/60 backdrop-blur">
          <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-8 gap-y-4 px-5 py-5 lg:px-8">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                <t.icon className="size-4 text-accent" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow text-accent">Pourquoi nous</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Plus qu'un nettoyage. Un entretien documenté.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 70}>
              <article className="group h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <w.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-bold tracking-tight">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-accent">Prestations</p>
              <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight md:text-5xl">
                Chaque élément de votre installation
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/services">
                Toutes les prestations <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lift"
                >
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.short}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                    En savoir plus
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow text-accent">Comment ça marche ?</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Cinq étapes, aucune zone d'ombre
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="font-mono text-3xl font-extrabold text-accent/25">{s.n}</span>
                <p className="mt-4 text-sm leading-relaxed font-medium">{s.t}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* AVANT / APRÈS */}
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <p className="eyebrow text-accent">Avant / Après</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink-foreground md:text-5xl">
              Le résultat se constate, il ne se décrit pas
            </h2>
            <p className="mt-4 max-w-xl text-sm text-ink-muted">
              Exemples de démonstration réalisés pour ce prototype — il ne s'agit pas de chantiers
              clients réels.
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <BeforeAfterSlider
              before={GALLERY[0].before}
              after={GALLERY[0].after}
              alt="Hotte de cuisine professionnelle"
            />
          </Reveal>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {GALLERY.map((g, i) => (
              <Reveal key={g.title} delay={i * 70}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group w-full overflow-hidden rounded-2xl border border-ink-border bg-ink-soft text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/60"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <img
                          src={g.after}
                          alt={`${g.title} — après intervention (démonstration)`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-ink-foreground uppercase">
                          Démonstration
                        </span>
                      </span>
                      <span className="block p-5">
                        <span className="block text-sm font-bold text-ink-foreground">
                          {g.title}
                        </span>
                        <span className="mt-1 block text-xs text-ink-muted">{g.type}</span>
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogTitle>{g.title} — démonstration</DialogTitle>
                    <DialogDescription>{g.text}</DialogDescription>
                    <BeforeAfterSlider before={g.before} after={g.after} alt={g.title} />
                    <p className="text-xs text-muted-foreground">Type d'intervention : {g.type}</p>
                  </DialogContent>
                </Dialog>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE MÉTHODE */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow text-accent">Notre méthode</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Six étapes, du relevé au suivi
          </h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-y-10 border-l border-border pl-8 md:grid-cols-2 md:gap-x-12">
          {METHOD.map((m, i) => (
            <Reveal as="li" key={m.n} delay={i * 60}>
              <span className="font-mono text-xs font-bold text-accent">{m.n}</span>
              <h3 className="mt-2 text-lg font-bold tracking-tight">{m.title}</h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                {m.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* POUR QUI */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <p className="eyebrow text-accent">Pour qui ?</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
              Les établissements que nous accompagnons
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a} delay={i * 50}>
                <Link
                  to="/devis"
                  className="group flex min-h-28 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-lift"
                >
                  <ShieldCheck className="size-5 text-muted-foreground transition-colors group-hover:text-accent" />
                  <span className="mt-6 text-base font-bold tracking-tight">{a}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-accent">Zones d'intervention</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              Deux pôles, une même exigence
            </h2>
            <div className="mt-8 space-y-4">
              {ZONES.map((z) => (
                <Link
                  key={z.slug}
                  to="/zones/$slug"
                  params={{ slug: z.slug }}
                  className="block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/60"
                >
                  <p className="text-base font-bold tracking-tight">{z.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{z.description}</p>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <FranceMap />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8 lg:py-28">
          <Reveal>
            <p className="eyebrow text-accent">FAQ</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              Vos questions, nos réponses
            </h2>
          </Reveal>
          <Accordion type="single" collapsible className="mt-10">
            {FAQ.slice(0, 5).map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="ghost" className="mt-6 px-0">
            <Link to="/faq">
              Toutes les questions <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="surface-ink relative overflow-hidden">
        <div className="grid-tech absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-ink-foreground sm:text-6xl">
              Votre installation mérite un vrai suivi.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted">
              Décrivez-nous votre installation et obtenez une réponse adaptée.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 px-8 text-base">
                <Link to="/devis">Obtenir mon devis</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 border-ink-border bg-transparent px-8 text-base text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/contact">WhatsApp</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
