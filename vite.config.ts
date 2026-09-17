import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Lovable defaults Nitro to Cloudflare.
 * Sur Vercel, on pin le preset `vercel` pour générer `.vercel/output`.
 * (NITRO_PRESET / VERCEL env détectés aussi automatiquement.)
 */
const onVercel =
  process.env["VERCEL"] === "1" ||
  process.env["NITRO_PRESET"] === "vercel" ||
  Boolean(process.env["VERCEL_ENV"]);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  nitro: onVercel
    ? {
        preset: "vercel",
      }
    : true,
});
