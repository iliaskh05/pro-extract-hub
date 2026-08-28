import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, X } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL: Msg = {
  role: "assistant",
  content:
    "Bonjour, je peux vous aider à identifier votre besoin ou vous guider vers une demande de devis.",
};

const QUICK: Array<{
  label: string;
  action: "devis" | "zones" | "methode" | "contact" | "send";
  text?: string;
}> = [
  { label: "Demander un devis", action: "devis" },
  { label: "Zone d'intervention", action: "zones" },
  { label: "Comment ça marche ?", action: "send", text: "Comment ça marche ?" },
  { label: "Parler à un expert", action: "contact" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askAssistant);
  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  function handleQuick(item: (typeof QUICK)[number]) {
    if (item.action === "send" && item.text) {
      void send(item.text);
      return;
    }
    setOpen(false);
    if (item.action === "devis") navigate({ to: "/devis" });
    if (item.action === "zones") navigate({ to: "/zones" });
    if (item.action === "contact") navigate({ to: "/contact" });
  }

  return (
    <div className="fixed right-4 bottom-40 z-50 flex flex-col items-end gap-3 lg:bottom-24">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant Salis"
          className="panel-in flex h-[31rem] max-h-[calc(100svh-9rem)] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-lift"
        >
          <div className="surface-ink flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M8 13.5c1.2 1.4 6.8 1.4 8 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="9.2" cy="10" r="1" fill="currentColor" />
                  <circle cx="14.8" cy="10" r="1" fill="currentColor" />
                </svg>
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

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "step-in max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "assistant"
                    ? "rounded-tl-md bg-secondary text-secondary-foreground"
                    : "ml-auto rounded-tr-md bg-primary text-primary-foreground",
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
              <div className="flex flex-wrap gap-1.5 pt-2">
                {QUICK.map((s) =>
                  s.action === "devis" ? (
                    <Link
                      key={s.label}
                      to="/devis"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent hover:bg-secondary"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleQuick(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent hover:bg-secondary"
                    >
                      {s.label}
                    </button>
                  ),
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3">
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
        onClick={() => {
          setOpen((v) => {
            if (!v) track("Chatbot Open");
            return !v;
          });
        }}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Salis"}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95",
          !open && "glow-breathe",
        )}
      >
        {open ? (
          <X className="size-5" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8 13.6c1.3 1.5 6.7 1.5 8 0"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="9.2" cy="10" r="1.05" fill="currentColor" />
            <circle cx="14.8" cy="10" r="1.05" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
