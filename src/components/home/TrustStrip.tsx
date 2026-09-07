import { Reveal } from "@/components/Reveal";
import { Camera, ClipboardList, ShieldCheck, CalendarClock } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Intervention technique encadrée" },
  { icon: Camera, label: "Photos avant / après" },
  { icon: ClipboardList, label: "Compte rendu d'intervention" },
  { icon: CalendarClock, label: "Suivi périodique" },
] as const;

export function TrustStrip() {
  return (
    <section id="preuves" className="border-y border-border bg-secondary/50" aria-label="Nos engagements">
      <div className="shell py-10 lg:py-12">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal as="li" key={item.label} delay={i * 60}>
              <span className="flex items-center gap-3 text-sm font-medium">
                <item.icon className="size-4 shrink-0 stroke-[1.5] text-accent" aria-hidden="true" />
                {item.label}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
