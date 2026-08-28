/**
 * Génère public/sitemap.xml et public/robots.txt avec VITE_SITE_URL.
 * Exécuté avant build si la variable est définie.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
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

const base = loadEnv();
const services = [
  "degraissage-hotte",
  "nettoyage-filtres",
  "nettoyage-conduit",
  "nettoyage-moteur-caisson",
  "entretien-periodique",
  "diagnostic-devis",
];
const zones = ["paris", "perpignan", "troyes", "dijon"];

const paths = [
  { path: "/", priority: "1.0" },
  { path: "/services", priority: "0.9" },
  ...services.map((s) => ({ path: `/services/${s}`, priority: "0.8" })),
  { path: "/zones", priority: "0.8" },
  ...zones.map((z) => ({ path: `/zones/${z}`, priority: "0.9" })),
  { path: "/methode", priority: "0.7" },
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
Disallow: /admin

Sitemap: ${loc("/sitemap.xml")}
`;

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(root, "public/robots.txt"), robots, "utf8");

console.log(
  base
    ? `[seo] sitemap + robots générés pour ${base}`
    : "[seo] sitemap + robots générés (URLs relatives — définissez VITE_SITE_URL avant prod)",
);
