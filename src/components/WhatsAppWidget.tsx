import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER } from "@/lib/site";
import { toast } from "sonner";

type WaOption = { label: string; message: string; goto?: "/devis" | "/zones" };

const OPTIONS: WaOption[] = [
  {
    label: "Demander un devis",
    message: "Bonjour, je souhaite demander un devis.",
    goto: "/devis",
  },
  { label: "Poser une question", message: "Bonjour, j'ai une question." },
  { label: "Être rappelé", message: "Bonjour, pouvez-vous me rappeler ?" },
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handle(option: (typeof OPTIONS)[number]) {
    const link = whatsappLink(option.message);
    if (link) {
      window.open(link, "_blank", "noopener");
      setOpen(false);
      return;
    }
    toast.info("Prototype — WhatsApp non connecté", {
      description:
        "Le numéro WhatsApp Business sera renseigné avant la mise en ligne. Message simulé : « " +
        option.message +
        " »",
    });
    setOpen(false);
    if (option.goto) navigate({ to: option.goto });
  }

  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-3 lg:bottom-6">
      {open && (
        <div className="panel-in w-[19rem] overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          <div className="surface-ink px-5 py-4">
            <p className="text-sm font-semibold text-ink-foreground">
              Besoin d'une réponse rapide ?
            </p>
            <p className="mt-1 text-xs text-ink-muted">Choisissez le motif, nous vous orientons.</p>
          </div>
          <div className="flex flex-col gap-1.5 p-3">
            {OPTIONS.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => handle(o)}
                className="rounded-lg border border-border px-4 py-3 text-left text-sm font-medium transition-colors hover:border-accent/50 hover:bg-secondary"
              >
                {o.label}
              </button>
            ))}
            {!WHATSAPP_NUMBER && (
              <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                Prototype : numéro WhatsApp Business à connecter.
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer WhatsApp" : "Ouvrir WhatsApp"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.68_0.15_150)] text-white shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
