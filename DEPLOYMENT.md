# Déploiement — Salis 3 Hottes

Guide de mise en production pour le site TanStack Start + Nitro (compatible Vercel / Cloudflare / Lovable).

## Prérequis

- Node.js 20+
- Compte Supabase (projet configuré)
- Compte Resend (emails transactionnels)
- Domaine final + `VITE_SITE_URL`

## Installation locale

```bash
npm ci
cp .env.example .env
# Renseigner les variables (voir ci-dessous)
npm run dev
```

## Variables d'environnement

| Variable                        | Scope   | Obligatoire | Description                           |
| ------------------------------- | ------- | ----------- | ------------------------------------- |
| `VITE_SITE_URL`                 | Public  | Oui         | URL canonique sans slash final        |
| `VITE_SUPABASE_URL`             | Public  | Oui         | URL projet Supabase                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public  | Oui         | Clé anon / publishable                |
| `VITE_WHATSAPP_NUMBER`          | Public  | Recommandé  | Format `33612345678` (ex. `212669200560`) |
| `VITE_PLAUSIBLE_DOMAIN`         | Public  | Optionnel   | Analytics (consentement requis)       |
| `SUPABASE_URL`                  | Serveur | Oui         | Même URL que ci-dessus                |
| `SUPABASE_PUBLISHABLE_KEY`      | Serveur | Oui         | Clé publishable                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Serveur | Oui         | **Jamais** en `VITE_*`                |
| `RESEND_API_KEY`                | Serveur | Recommandé  | API Resend                            |
| `RESEND_FROM`                   | Serveur | Recommandé  | Expéditeur vérifié                    |
| `LEAD_NOTIFY_EMAIL`             | Serveur | Recommandé  | Notification interne                  |
| `GOOGLE_AI_API_KEY`             | Serveur | Recommandé  | Assistant chat Gemini (Google AI Studio) |
| `GOOGLE_AI_MODEL`               | Serveur | Optionnel   | Défaut `gemini-3.5-flash`             |
| `OPENAI_API_KEY`                | Serveur | Optionnel   | Assistant chat (si pas de clé Gemini) |

Données entreprise (téléphone, email, SIRET, adresse) : `src/lib/site.ts`.

## Supabase

### Migrations

Appliquer dans l'ordre chronologique :

1. `supabase/migrations/20260816125108_*.sql`
2. `supabase/migrations/20260823170000_production_readiness.sql`
3. `supabase/migrations/20260828180000_lead_qualification.sql`

### Sécurité

- Désactiver l'inscription publique (Auth).
- Créer un utilisateur staff + ligne `staff_profiles` avec rôle `admin`.
- Vérifier RLS : un visiteur anonyme ne peut **pas** lire les leads ni les photos privées.
- Bucket `lead-documents` : policies restrictives, signed URLs pour upload.

### Test lead

1. Soumettre un devis sur `/devis`.
2. Vérifier l'entrée en base (`leads`).
3. Vérifier emails admin + client (si Resend configuré).
4. Le lead doit rester enregistré même si l'email échoue.

## Build production

```bash
export VITE_SITE_URL=https://www.votredomaine.fr
npm run build
npm run preview   # test local optionnel
```

`npm run build` exécute `generate:seo` → met à jour `public/sitemap.xml` et `public/robots.txt`.

## Déploiement Vercel

1. Connecter le dépôt GitHub sur [vercel.com/new](https://vercel.com/new).
2. Framework : **TanStack Start** (déjà fixé dans `vercel.json`).
3. **Ne pas** renseigner un Output Directory custom (`dist`, `.output`, etc.) — Nitro génère `.vercel/output`.
4. Build Command : `npm run build` (défaut via `vercel.json`).
5. Node.js : **20.x** (Settings → General → Node.js Version).
6. Ajouter les variables d'environnement (serveur + `VITE_*`) — voir tableau ci-dessus.
7. Définir le domaine et aligner `VITE_SITE_URL`.

Fichiers utiles :
- `vercel.json` — framework + commandes
- `vite.config.ts` — preset Nitro `vercel` quand `VERCEL=1`

### Erreurs fréquentes

| Symptôme | Cause | Correctif |
| --- | --- | --- |
| Build OK mais 404 / ERR_FUNCTION | Output Directory forcé à `dist` | Laisser vide / Auto |
| `cloudflare` / Workers dans les logs | Mauvais preset Nitro | Vérifier `VERCEL=1` et redeploy |
| `npm ci` échoue | Lockfile désynchronisé | `npm install` puis commit `package-lock.json` |
| Module not found `nitro` | Dependance manquante | `nitro` doit être dans `devDependencies` |

## En-têtes HTTP

Les en-têtes de sécurité de base sont appliqués dans `src/server.ts` :

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation désactivés)

## Rollback

1. Revenir au commit précédent sur la branche de production.
2. Redéployer.
3. Les migrations Supabase ne sont en général **pas** réversibles automatiquement — prévoir des migrations forward-only.

## Checklist post-déploiement

Voir `PRODUCTION_CHECKLIST.md` pour les tests manuels détaillés (pages, formulaire, admin, SEO, mobile).

## Support

- Source métier : `src/lib/site.ts`
- Schéma devis : `src/lib/quote-schema.ts`
- Validation partagée : `src/lib/quote-validation.ts`
