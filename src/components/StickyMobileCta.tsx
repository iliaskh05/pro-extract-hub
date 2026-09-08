import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { whatsappLink, whatsappUnavailableMessage } from "@/lib/site";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

export function StickyMobileCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/devis")) return null;
  const wa = whatsappLink();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <button
          type="button"
          aria-label="Ouvrir WhatsApp"
          onClick={() => {
            if (wa) {
              track("WhatsApp Click", { from: "sticky" });
              window.open(wa, "_blank", "noopener");
            } else toast.info(whatsappUnavailableMessage().title, whatsappUnavailableMessage());
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[oklch(0.68_0.15_150)] text-white active:scale-[0.97]"
        >
          <MessageCircle className="size-5" />
        </button>
        <Link
          to="/devis"
          className="flex h-12 min-h-12 flex-1 items-center justify-center rounded-sm bg-primary px-4 text-[0.9375rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Obtenir mon devis
        </Link>
      </div>
    </div>
  );
}
