import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Sur Vercel (VERCEL=1) : preset Nitro `vercel` + runtime Node 20.
 * Ailleurs (Lovable) : auto-détection Nitro (Cloudflare).
 */
const onVercel =
  process.env["VERCEL"] === "1" ||
  process.env["NITRO_PRESET"] === "vercel" ||
  Boolean(process.env["VERCEL_ENV"]);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: onVercel
    ? {
        preset: "vercel",
        vercel: {
          functions: {
            runtime: "nodejs20.x",
          },
        },
      }
    : true,
  vite: {
    build: {
      chunkSizeWarningLimit: 1400,
    },
  },
});
