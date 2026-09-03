import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/**
 * Desktop : liste de questions à gauche, réponse active à droite.
 * Mobile : accordéon classique, la réponse se déplie sous la question.
 */
export function FaqExplorer({ items, className }: { items: FaqItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [openOnMobile, setOpenOnMobile] = useState<number | null>(0);

  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)]!;

  return (
    <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-16", className)}>
      <ul className="lg:col-span-7">
        {items.map((item, i) => {
          const isActive = i === active;
          const isOpen = i === openOnMobile;
          return (
            <li key={item.q} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setOpenOnMobile(isOpen ? null : i);
                  }}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-300 lg:py-6",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="text-base font-semibold tracking-tight lg:text-lg">
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      "mt-0.5 size-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45",
                      isActive ? "text-accent" : "text-muted-foreground",
                    )}
                  />
                </button>
              </h3>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-out lg:hidden",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-32 rounded-2xl border border-border bg-card p-8">
          <p className="eyebrow text-accent">Réponse</p>
          <p key={current.q} className="step-in mt-4 text-sm leading-relaxed text-muted-foreground">
            {current.a}
          </p>
        </div>
      </div>
    </div>
  );
}
