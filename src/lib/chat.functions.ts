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

type ChatMessage = z.infer<typeof schema>["messages"][number];

/**
 * Clés Google AI Studio récentes (préfixe AQ.) : API native Gemini uniquement
 * (header x-goog-api-key), pas le mode compatible OpenAI.
 */
async function askGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<string | null> {
  let start = 0;
  while (start < messages.length && messages[start]?.role === "assistant") start += 1;
  const contents = messages.slice(start).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  if (!contents.length) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 400,
        },
      }),
    },
  );
  if (!res.ok) return null;

  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
}

/**
 * Chat de l'« Assistant Salis ».
 *
 * Architecture sécurisée : le frontend n'appelle jamais un fournisseur IA
 * directement. Chaîne : Frontend → server function → Gemini / OpenAI / Lovable / règles.
 *
 * Priorité côté serveur :
 * 1. GOOGLE_AI_API_KEY (+ optionnel GOOGLE_AI_MODEL, défaut gemini-3.5-flash)
 * 2. OPENAI_API_KEY (+ optionnel OPENAI_MODEL)
 * 3. LOVABLE_API_KEY (passerelle Lovable)
 * 4. Moteur déterministe de secours
 *
 * Ne jamais exposer de clé dans le frontend.
 */
export const askAssistant = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const last = data.messages[data.messages.length - 1]?.content ?? "";
    const fallback = ruleBasedAnswer(last);

    const payload = {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
    };

    const googleKey = process.env["GOOGLE_AI_API_KEY"];
    if (googleKey) {
      try {
        const model = process.env["GOOGLE_AI_MODEL"] || "gemini-3.5-flash";
        const reply = await askGemini(googleKey, model, SYSTEM_PROMPT, data.messages);
        if (reply) return { reply, mode: "gemini" as const };
      } catch {
        /* fallback below */
      }
    }

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
