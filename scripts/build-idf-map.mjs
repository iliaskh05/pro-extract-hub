/**
 * Génère src/lib/generated/idf-map.json — 8 départements IDF (SVG).
 * Inclut Paris (75) comme un seul polygone (pas les arrondissements ultra-détaillés).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "src/lib/generated");
const outFile = resolve(outDir, "idf-map.json");

const IDF_CODES = ["75", "77", "78", "91", "92", "93", "94", "95"];

const DEPS_URL =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

const depsRes = await fetch(DEPS_URL);
if (!depsRes.ok) throw new Error(`deps geojson: ${depsRes.status}`);
const deps = await depsRes.json();

const features = deps.features.filter((f) => IDF_CODES.includes(String(f.properties?.code ?? "")));

if (features.length < 8) {
  throw new Error(`Expected 8 IDF departments, got ${features.length}`);
}

const bounds = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };

function walkCoords(coords, onPoint) {
  if (typeof coords[0] === "number") {
    onPoint(coords);
    return;
  }
  for (const c of coords) walkCoords(c, onPoint);
}

for (const feature of features) {
  walkCoords(feature.geometry.coordinates, ([lon, lat]) => {
    bounds.minLon = Math.min(bounds.minLon, lon);
    bounds.maxLon = Math.max(bounds.maxLon, lon);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
  });
}

const width = 800;
const height = 640;
const pad = 28;

function project([lon, lat]) {
  const x = pad + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - pad * 2);
  const y = pad + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2);
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}

function ringToPath(ring) {
  const pts = ring.map(project);
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ") + " Z";
}

function geometryToPaths(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const paths = [];
  for (const polygon of polygons) {
    for (const ring of polygon) paths.push(ringToPath(ring));
  }
  return paths;
}

const regions = [];
for (const feature of features) {
  const code = String(feature.properties?.code ?? "");
  const label = String(feature.properties?.nom ?? code);
  for (const d of geometryToPaths(feature.geometry)) {
    regions.push({ code, kind: "dept", label, d });
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify({ viewBox: `0 0 ${width} ${height}`, regions }));
console.log(
  `[map] idf-map.json généré (${regions.length} polygones, ${IDF_CODES.length} départements)`,
);
