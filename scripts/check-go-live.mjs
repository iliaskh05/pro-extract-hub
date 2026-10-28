/**
 * Vérifie les variables d'environnement pour un go-live Vercel + Supabase.
 * Usage: node scripts/check-go-live.mjs
 * Ne lit que .env local — n'affiche jamais les valeurs secrètes.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const envPath = path.join(root, ".env");

function parseEnv(raw) {
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const required = [
  "VITE_SITE_URL",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
];
const requiredServerOneOf = [["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"]];
const recommended = [
  "UPLOAD_TOKEN_SECRET",
  "VITE_WHATSAPP_NUMBER",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "LEAD_NOTIFY_EMAIL",
];

const env = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, "utf8")) : {};

console.log("\n=== Salis3Hottes — check go-live ===\n");
if (!fs.existsSync(envPath)) {
  console.log("❌ Pas de fichier .env — copie .env.example vers .env\n");
} else {
  console.log("✓ .env trouvé\n");
}

let blockers = 0;
for (const k of required) {
  const ok = Boolean(env[k]?.trim());
  console.log(`${ok ? "✓" : "❌"} ${k}${ok ? "" : "  ← à coller (Supabase / domaine)"}`);
  if (!ok) blockers++;
}
for (const group of requiredServerOneOf) {
  const ok = group.some((k) => Boolean(env[k]?.trim()));
  console.log(
    `${ok ? "✓" : "❌"} ${group.join(" OU ")}${ok ? "" : "  ← clé secrète Supabase"}`,
  );
  if (!ok) blockers++;
}
console.log("");
for (const k of recommended) {
  const ok = Boolean(env[k]?.trim());
  console.log(`${ok ? "✓" : "○"} ${k}${ok ? "" : "  (recommandé)"}`);
}

const secret = crypto.randomBytes(32).toString("hex");
console.log("\n--- Secret upload à coller si manquant ---");
console.log(`UPLOAD_TOKEN_SECRET=${secret}`);

console.log("\n--- Projet Supabase (config.toml) ---");
console.log("project_id: mfpgsdoyfomaetrkvlfw");
console.log("URL type: https://mfpgsdoyfomaetrkvlfw.supabase.co");
console.log(
  "Dashboard: https://supabase.com/dashboard/project/mfpgsdoyfomaetrkvlfw/settings/api",
);

console.log("\n--- Vercel : coller les mêmes variables en Production ---");
console.log("https://vercel.com/dashboard → Project → Settings → Environment Variables");
console.log("Puis Redeploy.");

console.log(
  `\nRésultat: ${blockers === 0 ? "✅ Prêt côté variables locales" : `❌ ${blockers} blocker(s) — fournis les clés pour continuer`}\n`,
);
process.exit(blockers === 0 ? 0 : 1);
