import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { toast } from "sonner";

export function StickyMobileCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/devis")) return null;
  const wa = whatsappLink();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Ouvrir WhatsApp"
          onClick={() => {
            if (wa) window.open(wa, "_blank", "noopener");
            else
              toast.info("Prototype — WhatsApp non connecté", {
                description: "Le numéro WhatsApp Business sera renseigné avant la mise en ligne.",
              });
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.68_0.15_150)] text-white"
        >
          <MessageCircle className="size-5" />
        </button>
        <Link
          to="/devis"
          className="flex h-12 min-h-12 flex-1 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Obtenir mon devis
        </Link>
      </div>
    </div>
  );
}
