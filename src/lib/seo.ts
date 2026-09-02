import { SERVICES, activeZones, siteUrl } from "@/lib/site";
import { SECTORS } from "@/lib/sectors";

/** URL absolue pour canonical, Open Graph et sitemap. */
export function absoluteUrl(path: string): string {
  const base = siteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const OG_IMAGE_PATH = "/brand/logo-white.png";

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}

export type SitemapEntry = {
  path: string;
  priority: string;
  changefreq?: "weekly" | "monthly" | "yearly";
};

export function sitemapEntries(): SitemapEntry[] {
  return [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/services", priority: "0.9", changefreq: "weekly" },
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      priority: "0.8",
      changefreq: "monthly" as const,
    })),
    { path: "/zones", priority: "0.8", changefreq: "weekly" },
    ...activeZones().map((z) => ({
      path: `/zones/${z.slug}`,
      priority: "0.9",
      changefreq: "monthly" as const,
    })),
    { path: "/methode", priority: "0.7", changefreq: "monthly" },
    { path: "/tarifs", priority: "0.7", changefreq: "monthly" },
    { path: "/secteurs", priority: "0.8", changefreq: "monthly" },
    ...SECTORS.map((s) => ({
      path: `/secteurs/${s.slug}`,
      priority: "0.75",
      changefreq: "monthly" as const,
    })),
    { path: "/devis", priority: "0.9", changefreq: "monthly" },
    { path: "/faq", priority: "0.6", changefreq: "monthly" },
    { path: "/contact", priority: "0.6", changefreq: "monthly" },
    { path: "/mentions-legales", priority: "0.3", changefreq: "yearly" },
    { path: "/confidentialite", priority: "0.3", changefreq: "yearly" },
  ];
}

export function buildSitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = sitemapEntries()
    .map(
      (e) => `  <url>
    <loc>${escapeXml(absoluteUrl(e.path))}</loc>
    <lastmod>${today}</lastmod>${e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ""}
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildRobotsTxt(): string {
  const sitemap = absoluteUrl("/sitemap.xml");
  return `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${sitemap}
`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

type PageHeadOptions = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

/** Meta SEO cohérents sur toutes les pages publiques. */
export function pageHead(opts: PageHeadOptions) {
  const meta = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.ogTitle ?? opts.title },
    { property: "og:description", content: opts.ogDescription ?? opts.description },
    { property: "og:type", content: opts.ogType ?? "website" },
    { property: "og:url", content: absoluteUrl(opts.path) },
    { property: "og:image", content: ogImageUrl() },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogImageUrl() },
  ];

  if (opts.noindex) {
    meta.push({ name: "robots", content: "noindex" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: absoluteUrl(opts.path) }],
    scripts: opts.jsonLd
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(opts.jsonLd),
          },
        ]
      : undefined,
  };
}
