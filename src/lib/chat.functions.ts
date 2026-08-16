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
 * directement. Cette server function fait office de proxy. Elle utilise la
 * passerelle IA Lovable si LOVABLE_API_KEY est disponible, sinon un moteur de
 * réponses déterministe (prototype). Pour brancher OpenAI plus tard, renseigner
 * OPENAI_API_KEY côté serveur et remplacer l'URL/modèle ci-dessous.
 */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const last = data.messages[data.messages.length - 1]?.content ?? "";
    const fallback = ruleBasedAnswer(last);

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
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
        }),
      });
      if (!res.ok) return { reply: fallback, mode: "rules" as const };
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const reply = json.choices?.[0]?.message?.content?.trim();
      return reply
        ? { reply, mode: "ai" as const }
        : { reply: fallback, mode: "rules" as const };
    } catch {
      return { reply: fallback, mode: "rules" as const };
    }
  });
