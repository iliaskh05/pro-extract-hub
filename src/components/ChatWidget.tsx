import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";
import { saveQuotePrefill } from "@/lib/quote-prefill";
import { phoneHref, whatsappLink, whatsappUnavailableMessage } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL: Msg = {
  role: "assistant",
  content:
    "Bonjour, je suis l'Assistant Salis. Je peux répondre à vos questions ou vous orienter vers une demande de devis.",
};

const QUICK: Array<{
  label: string;
  action: "devis" | "services" | "zones" | "photos" | "callback" | "send";
  text?: string;
}> = [
  { label: "Obtenir un devis", action: "devis" },
  {
    label: "Quels services proposez-vous ?",
    action: "send",
    text: "Quels services proposez-vous ?",
  },
  { label: "Où intervenez-vous ?", action: "send", text: "Où intervenez-vous ?" },
  { label: "Envoyer des photos", action: "photos" },
  { label: "Être rappelé", action: "callback" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askAssistant);
  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const tel = phoneHref();
  const wa = whatsappLink();

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user" as const, content: value }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next.slice(-12) } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Je ne parviens pas à répondre pour le moment. Utilisez le formulaire de devis — notre équipe vous recontactera.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function goDevis(extra?: { message?: string }) {
    saveQuotePrefill({ landing_page: "/", service_source: "chat", ...extra });
    setOpen(false);
    navigate({ to: "/devis" });
  }

  function handleQuick(item: (typeof QUICK)[number]) {
    if (item.action === "send" && item.text) {
      void send(item.text);
      return;
    }
    if (item.action === "devis") {
      goDevis();
      return;
    }
    if (item.action === "photos") {
      goDevis({ message: "Je souhaite joindre des photos de mon installation." });
      return;
    }
    if (item.action === "callback") {
      if (tel) {
        track("Phone Click", { from: "chat" });
        window.location.href = tel;
      } else {
        goDevis({ message: "Je souhaite être rappelé pour mon projet." });
      }
      return;
    }
    if (item.action === "zones") {
      setOpen(false);
      navigate({ to: "/zones" });
    }
    if (item.action === "services") {
      setOpen(false);
      navigate({ to: "/services" });
    }
  }

  return (
    <div className="fixed right-4 bottom-40 z-50 flex flex-col items-end gap-3 lg:bottom-24">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant Salis"
          className="panel-in flex h-[32rem] max-h-[calc(100svh-9rem)] w-[22.5rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-lift"
        >
          <div className="surface-ink relative overflow-hidden px-4 py-4">
            <div
              className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent">
                  <Sparkles className="size-4" aria-hidden="true" />
                  <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-accent" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-foreground">Assistant Salis</p>
                  <p className="text-[10px] tracking-wider text-ink-muted uppercase">
                    Réponses guidées
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                className="rounded-md p-1.5 text-ink-muted hover:bg-ink-foreground/10"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "step-in max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "assistant"
                    ? "rounded-tl-md border border-border bg-secondary text-secondary-foreground"
                    : "ml-auto rounded-tr-md bg-primary text-primary-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="w-16 rounded-xl border border-border bg-secondary px-3.5 py-3">
                <span className="flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      style={{ animationDelay: `${d}ms` }}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    />
                  ))}
                </span>
              </div>
            )}
            {messages.length <= 1 && (
              <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
                {QUICK.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleQuick(s)}
                    className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-accent hover:bg-secondary"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-card/80 p-3 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2"
            >
              <label className="sr-only" htmlFor="chat-input">
                Votre message
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question…"
                className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
              <Link
                to="/devis"
                className="underline-offset-4 hover:underline"
                onClick={() => setOpen(false)}
              >
                Formulaire complet
              </Link>
              {wa && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  onClick={() => {
                    track("WhatsApp Click", { from: "chat-footer" });
                    window.open(wa, "_blank", "noopener");
                  }}
                >
                  <MessageCircle className="size-3" /> WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => {
            if (!v) track("Chatbot Open");
            return !v;
          });
        }}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Salis"}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95",
          !open && "glow-breathe",
        )}
      >
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
        )}
        {open ? <X className="size-5" /> : <Sparkles className="size-5" />}
      </button>
    </div>
  );
}
