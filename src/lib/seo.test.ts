import { describe, expect, it } from "vitest";
import { buildSitemapXml } from "./seo";

describe("public sitemap", () => {
  it("uses the Salis3Hottes public domain for every URL", () => {
    const xml = buildSitemapXml();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(urls.length).toBeGreaterThan(20);
    expect(urls).toContain("https://salis3hottes.fr/zones/lyon");
    expect(urls.every((url) => url?.startsWith("https://salis3hottes.fr/"))).toBe(true);
  });

  it("does not claim generation time is a content modification date", () => {
    expect(buildSitemapXml()).not.toContain("<lastmod>");
  });
});