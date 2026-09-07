import { Reveal } from "@/components/Reveal";
import { TimelineStep } from "@/components/TimelineStep";
import { METHOD } from "@/lib/method";
import { METHOD_ICONS } from "@/lib/ui-icons";

export function MethodSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
      {METHOD.map((m, i) => (
        <Reveal as="li" key={m.n} delay={i * 60}>
          <TimelineStep n={m.n} title={m.title} text={m.text} icon={METHOD_ICONS[m.n]} tone={tone} />
        </Reveal>
      ))}
    </ol>
  );
}
