/**
 * Génère public/sitemap.xml et public/robots.txt avec VITE_SITE_URL.
 * Zones / services / secteurs lus depuis les sources TypeScript (évite les écarts).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^VITE_SITE_URL=(.*)$/);
      if (m)
        return m[1]
          .trim()
          .replace(/^["']|["']$/g, "")
          .replace(/\/$/, "");
    }
  } catch {
    /* pas de .env local */
  }
  return (process.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
}

/** Extrait les `slug: "..."` d'un tableau exporté dans un fichier source. */
function loadSlugs(relPath, exportName) {
  const raw = readFileSync(resolve(root, relPath), "utf8");
  const re = new RegExp(
    `export const ${exportName}[\\s\\S]*?= \\[([\\s\\S]*?)\\];`,
  );
  const block = raw.match(re)?.[1];
  if (!block) {
    throw new Error(`[seo] impossible de lire ${exportName} dans ${relPath}`);
  }
  return [...block.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const base = loadEnv();
const services = loadSlugs("src/lib/site.ts", "SERVICES");
const zones = loadSlugs("src/lib/site.ts", "ZONES");
const sectors = loadSlugs("src/lib/sectors.ts", "SECTORS");

const paths = [
  { path: "/", priority: "1.0" },
  { path: "/services", priority: "0.9" },
  ...services.map((s) => ({ path: `/services/${s}`, priority: "0.8" })),
  { path: "/zones", priority: "0.8" },
  ...zones.map((z) => ({ path: `/zones/${z}`, priority: "0.9" })),
  { path: "/methode", priority: "0.7" },
  { path: "/tarifs", priority: "0.7" },
  { path: "/secteurs", priority: "0.8" },
  ...sectors.map((s) => ({ path: `/secteurs/${s}`, priority: "0.75" })),
  { path: "/devis", priority: "0.9" },
  { path: "/faq", priority: "0.6" },
  { path: "/contact", priority: "0.6" },
  { path: "/mentions-legales", priority: "0.3" },
  { path: "/confidentialite", priority: "0.3" },
];

const today = new Date().toISOString().slice(0, 10);
const loc = (p) => (base ? `${base}${p}` : p);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (e) =>
      `  <url><loc>${loc(e.path)}</loc><lastmod>${today}</lastmod><priority>${e.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${loc("/sitemap.xml")}
`;

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(root, "public/robots.txt"), robots, "utf8");

console.log(
  base
    ? `[seo] sitemap + robots générés pour ${base} (${zones.length} zones, ${services.length} services)`
    : "[seo] sitemap + robots générés (URLs relatives — définissez VITE_SITE_URL avant prod)",
);
