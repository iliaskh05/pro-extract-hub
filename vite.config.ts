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
  // `vercel.functions.runtime` is a real Nitro v3 option, but
  // LovableViteTanstackOptions["nitro"] only exposes preset/output/cloudflare
  // (see its .d.ts) — the wrapper's type is intentionally narrower than what
  // Nitro itself accepts, so this needs a cast rather than a fabricated type.
  nitro: onVercel
    ? ({
        preset: "vercel",
        vercel: {
          functions: {
            runtime: "nodejs20.x",
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    : true,
  vite: {
    build: {
      chunkSizeWarningLimit: 1400,
    },
  },
});
