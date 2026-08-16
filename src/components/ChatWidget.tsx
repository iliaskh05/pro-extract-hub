import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL: Msg = {
  role: "assistant",
  content:
    "Bonjour, je peux vous aider à identifier la prestation adaptée à votre installation ou vous guider vers une demande de devis.",
};

const SUGGESTIONS = [
  "Je suis un restaurant à Paris.",
  "Combien coûte le nettoyage d'une hotte ?",
  "Vous intervenez à Perpignan ?",
  "Quand pouvez-vous intervenir ?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askAssistant);
  const endRef = useRef<HTMLDivElement>(null);

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
            "Je ne parviens pas à répondre pour le moment. Vous pouvez lancer une demande de devis, notre équipe vous répondra.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-42 z-50 flex flex-col items-end gap-3 lg:bottom-24">
      {open && (
        <div className="flex h-[28rem] w-[21rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          <div className="surface-ink flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Bot className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-foreground">Assistant Extraction</p>
                <p className="text-[10px] tracking-wider text-ink-muted uppercase">
                  Prototype · réponses guidées
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

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "bg-secondary text-secondary-foreground"
                    : "ml-auto bg-primary text-primary-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="w-16 rounded-xl bg-secondary px-3.5 py-3">
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
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
            <Link
              to="/devis"
              onClick={() => setOpen(false)}
              className="mb-2 flex h-10 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Obtenir mon devis
            </Link>
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
                placeholder="Écrivez votre question…"
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
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Extraction"}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>
    </div>
  );
}
