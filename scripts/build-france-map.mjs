/**
 * Génère src/lib/generated/france-map.json à partir du GeoJSON métropole.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const geoPath = process.argv[2] ?? resolve(root, "node_modules/.cache/france-regions.geojson");

let geo;
try {
  geo = JSON.parse(readFileSync(geoPath, "utf8"));
} catch {
  const url =
    "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
  geo = await res.json();
  mkdirSync(resolve(root, "node_modules/.cache"), { recursive: true });
  writeFileSync(geoPath, JSON.stringify(geo));
}

const bounds = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };

for (const feature of geo.features) {
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [lon, lat] of ring) {
        bounds.minLon = Math.min(bounds.minLon, lon);
        bounds.maxLon = Math.max(bounds.maxLon, lon);
        bounds.minLat = Math.min(bounds.minLat, lat);
        bounds.maxLat = Math.max(bounds.maxLat, lat);
      }
    }
  }
}

const width = 560;
const height = 600;
const pad = 20;

function project([lon, lat]) {
  const x = pad + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - pad * 2);
  const y = pad + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2);
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}

const paths = [];
for (const feature of geo.features) {
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const points = ring.map(project);
      const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ") + " Z";
      paths.push(d);
    }
  }
}

const cities = {
  paris: { lon: 2.3522, lat: 48.8566 },
  perpignan: { lon: 2.8954, lat: 42.6986 },
  troyes: { lon: 4.0744, lat: 48.2973 },
  dijon: { lon: 5.0415, lat: 47.322 },
};

const projected = Object.fromEntries(
  Object.entries(cities).map(([slug, { lon, lat }]) => [slug, project([lon, lat])]),
);

const out = { viewBox: `0 0 ${width} ${height}`, paths, bounds, projected };
const outDir = resolve(root, "src/lib/generated");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "france-map.json"), JSON.stringify(out, null, 2));
console.log("[map] france-map.json généré");
