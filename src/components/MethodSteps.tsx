import { Reveal } from "@/components/Reveal";
import { METHOD } from "@/lib/method";

export function MethodSteps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {METHOD.map((m, i) => (
        <Reveal as="li" key={m.n} delay={i * 60} className="bg-card">
          <article className="flex h-full flex-col p-6 lg:min-h-52 lg:p-7">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{m.n}</span>
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
