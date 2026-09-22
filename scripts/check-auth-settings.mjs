#!/usr/bin/env node
/**
 * Vérifie que l'inscription publique Supabase Auth est désactivée avant mise
 * en production. Doit être lancé avec de vraies variables d'environnement :
 *
 *   SUPABASE_URL=https://xxx.supabase.co node scripts/check-auth-settings.mjs
 *
 * Ne modifie rien — lecture seule via l'endpoint public /auth/v1/settings.
 */

const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];

if (!url) {
  console.error("[check-auth-settings] SUPABASE_URL (ou VITE_SUPABASE_URL) manquant.");
  process.exit(1);
}

const endpoint = `${url.replace(/\/+$/, "")}/auth/v1/settings`;

let res;
try {
  res = await fetch(endpoint);
} catch (err) {
  console.error(`[check-auth-settings] Impossible de joindre ${endpoint} :`, err.message);
  process.exit(1);
}

if (!res.ok) {
  console.error(`[check-auth-settings] Réponse HTTP ${res.status} depuis ${endpoint}`);
  process.exit(1);
}

const settings = await res.json();
const signupOpen = settings.disable_signup === false;

console.log(`[check-auth-settings] ${endpoint}`);
console.log(`  disable_signup = ${settings.disable_signup}`);

if (signupOpen) {
  console.error(
    "\n⚠️  L'inscription publique est OUVERTE. N'importe qui peut créer un compte " +
      "'authenticated'. Désactivez-la dans Dashboard Supabase → Authentication → " +
      "Providers/Settings avant la mise en production.\n",
  );
  process.exit(1);
}

console.log("✓ Inscription publique désactivée.");
