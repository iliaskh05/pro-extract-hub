import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SYSTEM_PROMPT, ruleBasedAnswer } from "./chat-rules";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

/**
 * Chat de l'« Assistant Extraction ».
 *
 * Architecture sécurisée : le frontend n'appelle jamais un fournisseur IA
 * directement. Chaîne : Frontend → server function → OpenAI / Lovable / règles.
 *
 * Priorité côté serveur :
 * 1. OPENAI_API_KEY (+ optionnel OPENAI_MODEL, défaut gpt-4o-mini)
 * 2. LOVABLE_API_KEY (passerelle Lovable)
 * 3. Moteur déterministe (prototype)
 *
 * Ne jamais exposer de clé dans le frontend.
 */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const last = data.messages[data.messages.length - 1]?.content ?? "";
    const fallback = ruleBasedAnswer(last);

    const payload = {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
    };

    const openaiKey = process.env["OPENAI_API_KEY"];
    if (openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env["OPENAI_MODEL"] || "gpt-4o-mini",
            ...payload,
            max_tokens: 400,
            temperature: 0.4,
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const reply = json.choices?.[0]?.message?.content?.trim();
          if (reply) return { reply, mode: "openai" as const };
        }
      } catch {
        /* fallback below */
      }
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: fallback, mode: "rules" as const };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          ...payload,
        }),
      });
      if (!res.ok) return { reply: fallback, mode: "rules" as const };
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const reply = json.choices?.[0]?.message?.content?.trim();
      return reply ? { reply, mode: "ai" as const } : { reply: fallback, mode: "rules" as const };
    } catch {
      return { reply: fallback, mode: "rules" as const };
    }
  });
