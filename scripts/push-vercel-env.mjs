/**
 * Push selected .env keys to the linked Vercel project (all environments).
 * Usage: node scripts/push-vercel-env.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");

const KEYS = [
  "VITE_SITE_URL",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "UPLOAD_TOKEN_SECRET",
  "VITE_WHATSAPP_NUMBER",
  "GOOGLE_AI_API_KEY",
  "GOOGLE_AI_MODEL",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "LEAD_NOTIFY_EMAIL",
];

const SENSITIVE = new Set([
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "UPLOAD_TOKEN_SECRET",
  "GOOGLE_AI_API_KEY",
  "RESEND_API_KEY",
  "OPENAI_API_KEY",
]);

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

const env = parseEnv(fs.readFileSync(envPath, "utf8"));

// Prefer the production domain if SITE_URL still points at an old preview name.
const preferred = "https://salis3hottes.fr";
if (
  !env.VITE_SITE_URL ||
  /pro-extract-hub\.vercel\.app/i.test(env.VITE_SITE_URL) ||
  /salis3hottes\.vercel\.app/i.test(env.VITE_SITE_URL) ||
  /lovable\.app/i.test(env.VITE_SITE_URL)
) {
  env.VITE_SITE_URL = preferred;
  console.log(`→ VITE_SITE_URL forcé sur ${preferred}`);
}

let ok = 0;
let skip = 0;
let fail = 0;

for (const key of KEYS) {
  const value = env[key]?.trim();
  if (!value) {
    skip++;
    console.log(`○ skip ${key} (vide)`);
    continue;
  }
  const args = [
    "env",
    "add",
    key,
    "--environment",
    "production,preview,development",
    "--value",
    value,
    "--force",
    "--yes",
  ];
  if (SENSITIVE.has(key)) args.push("--sensitive");

  const r = spawnSync("vercel", args, {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });
  if (r.status === 0) {
    ok++;
    console.log(`✓ ${key}`);
  } else {
    fail++;
    const err = (r.stderr || r.stdout || "").trim().split(/\r?\n/).slice(-3).join(" | ");
    console.log(`❌ ${key}: ${err || `exit ${r.status}`}`);
  }
}

console.log(`\nDone: ${ok} ok, ${skip} skip, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
