import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FaqExplorer } from "@/components/FaqExplorer";
import { FAQ } from "@/lib/faq";

export function FaqPreview() {
  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">FAQ</p>
          <h2 className="mt-4 text-3xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
            Vos questions, nos réponses
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <FaqExplorer items={FAQ.slice(0, 5)} className="mt-12" />
        </Reveal>

        <Link
          to="/faq"
          className="group mt-10 inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Toutes les questions
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
