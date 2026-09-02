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
| `VITE_WHATSAPP_NUMBER`          | Public  | Recommandé  | Format `33612345678`                  |
| `VITE_PLAUSIBLE_DOMAIN`         | Public  | Optionnel   | Analytics (consentement requis)       |
| `SUPABASE_URL`                  | Serveur | Oui         | Même URL que ci-dessus                |
| `SUPABASE_PUBLISHABLE_KEY`      | Serveur | Oui         | Clé publishable                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Serveur | Oui         | **Jamais** en `VITE_*`                |
| `RESEND_API_KEY`                | Serveur | Recommandé  | API Resend                            |
| `RESEND_FROM`                   | Serveur | Recommandé  | Expéditeur vérifié                    |
| `LEAD_NOTIFY_EMAIL`             | Serveur | Recommandé  | Notification interne                  |
| `OPENAI_API_KEY`                | Serveur | Optionnel   | Assistant chat (fallback local sinon) |

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

1. Connecter le dépôt GitHub.
2. Framework : détection automatique (Vite / TanStack Start via Nitro).
3. Ajouter toutes les variables d'environnement (serveur + `VITE_*`).
4. Build command : `npm run build`
5. Output : géré par Nitro (pas de configuration `vercel.json` requise dans ce repo).
6. Définir le domaine personnalisé et aligner `VITE_SITE_URL`.

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
