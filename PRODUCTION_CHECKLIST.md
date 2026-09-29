# Checklist production — Salis 3 Hottes

## Variables d'environnement

Copier `.env.example` vers `.env` (local) ou configurer sur Lovable / Cloudflare.

| Variable                        | Obligatoire | Usage                                                  |
| ------------------------------- | ----------- | ------------------------------------------------------ |
| `VITE_SITE_URL`                 | Oui         | URL canonique (sans slash final) — sitemap, OG, emails |
| `VITE_SUPABASE_URL`             | Oui         | Client Supabase                                        |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Oui         | Clé publique Supabase                                  |
| `SUPABASE_URL`                  | Oui         | Serveur                                                |
| `SUPABASE_PUBLISHABLE_KEY`      | Oui         | Serveur                                                |
| `SUPABASE_SECRET_KEY`           | Oui         | Devis et uploads, uniquement côté serveur               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Alternative | Compatibilité avec l'ancienne clé serveur               |
| `UPLOAD_TOKEN_SECRET`           | Oui         | Signature des sessions temporaires d'upload             |
| `RESEND_API_KEY`                | Recommandé  | Notifications email                                    |
| `RESEND_FROM`                   | Recommandé  | Expéditeur (domaine vérifié Resend)                    |
| `LEAD_NOTIFY_EMAIL`             | Recommandé  | Email interne nouvelles demandes                       |
| `VITE_WHATSAPP_NUMBER`          | Recommandé  | Format `33612345678`                                   |
| `VITE_PLAUSIBLE_DOMAIN`         | Optionnel   | Analytics (après consentement cookies)                 |
| `GOOGLE_AI_API_KEY`             | Recommandé  | Assistant chat Gemini (Google AI Studio)               |
| `GOOGLE_AI_MODEL`               | Optionnel   | Défaut `gemini-3.5-flash`                              |
| `OPENAI_API_KEY`                | Optionnel   | Assistant chat (si pas de clé Gemini)                  |

## Données entreprise

Renseigner dans `src/lib/site.ts` : téléphone, email, SIRET, adresse, réseaux sociaux, hébergeur.

## Supabase

⚠️ **Deux schémas de rôles ont coexisté sur ce projet** : `public.staff_profiles`
(`supabase/migrations/`, rôles `admin`/`commercial`) et `public.user_roles`
(`drizzle/migrations/`, rôles `admin`/`staff`/`user`, généré par Lovable Cloud).
Avant de toucher à quoi que ce soit, vérifiez lequel est réellement en place sur
votre base (SQL editor Supabase) :

```sql
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('staff_profiles', 'user_roles');

select policyname from pg_policies where tablename = 'leads';
```

1. Appliquer les migrations `supabase/migrations/` dans l'ordre :
   - `20260816125108_*.sql`
   - `20260823170000_production_readiness.sql`
   - `20260828180000_lead_qualification.sql`
   - `20260920120000_reconcile_staff_access.sql` ← **nouvelle**, résout le point ci-dessus.
     Idempotente : sûre à appliquer que `drizzle/migrations/` ait tourné ou non sur
     cette base. Elle garantit que `staff_profiles` et `user_roles` existent tous
     les deux, unifie `is_staff()` / `is_admin()` pour vérifier les deux tables, et
     recrée les policies `leads` sous des noms uniques (plus de conflit possible).
   - `20260922120000_fix_staff_function_permissions.sql` ← autorise les comptes
     authentifiés à exécuter les fonctions requises par les policies, tout en les
     maintenant interdites aux visiteurs anonymes.
2. Désactiver l'inscription publique Auth (Dashboard Supabase → Authentication →
   Providers/Settings → _Allow new users to sign up_ = OFF). Vérifiable avec :
   `SUPABASE_URL=https://<projet>.supabase.co node scripts/check-auth-settings.mjs`
   (lecture seule, échoue si l'inscription publique est encore ouverte).
3. Créer un utilisateur staff, puis lui donner le rôle admin dans **la table que
   l'étape « vérification » a identifiée comme active** (voir requêtes SQL en bas
   de `20260920120000_reconcile_staff_access.sql`).
4. Vérifier le bucket `lead-documents` et les policies RLS.
5. Une fois le schéma stabilisé, régénérer les types TypeScript
   (`npx supabase gen types typescript --project-id <id> --schema public > src/integrations/supabase/types.ts`)
   pour que `staff_profiles` soit typé et que le cast `as any` dans
   `src/routes/admin.tsx` puisse être retiré.

## Resend

1. Vérifier le domaine d'envoi.
2. Tester : soumission devis → email interne + confirmation client.

## WhatsApp

Configurer `VITE_WHATSAPP_NUMBER` et tester header, sticky mobile, chat, page contact.

## Assistant chat (Gemini)

1. Créer une clé sur [Google AI Studio](https://aistudio.google.com/apikey).
2. Définir `GOOGLE_AI_API_KEY` côté serveur (Lovable / Cloudflare — jamais en `VITE_*`).
3. Tester une question dans le widget chat du site.

Sans clé, l'assistant utilise des règles déterministes (réponses basiques).

## Domaine et hébergement

1. Définir `VITE_SITE_URL` sur le domaine final.
2. `npm run build` (génère `sitemap.xml` et `robots.txt`).
3. Déployer les assets statiques + fonctions serveur.

## Tests post-déploiement

### Pages publiques

- [ ] `/` — hero, sections, CTA
- [ ] `/services` et `/services/:slug`
- [ ] `/secteurs` et `/secteurs/:slug`
- [ ] `/zones` et `/zones/:slug`
- [ ] `/methode`, `/tarifs`, `/devis`, `/faq`, `/contact`
- [ ] `/mentions-legales`, `/confidentialite`

### Conversion

- [ ] Formulaire devis 5 étapes + confirmation
- [ ] Upload photos
- [ ] Urgence / contrat / fréquence en base
- [ ] Emails reçus (admin + client)
- [ ] UTM et attribution (`landing_page`, `service_source`, `zone_source`)

### Mobile

- [ ] Sticky CTA (devis, téléphone si configuré, WhatsApp si configuré)
- [ ] Chat Assistant Salis
- [ ] Formulaire et FAQ

### CRM `/admin`

- [ ] Connexion staff
- [ ] Filtres (statut, priorité, ville, établissement, fréquence, date)
- [ ] Bloc « À traiter rapidement »
- [ ] Deep link `?lead=<uuid>`
- [ ] Priorité et suivi maintenance

### SEO

- [ ] `sitemap.xml` avec URLs absolues
- [ ] `robots.txt` — `Disallow: /admin`
- [ ] Meta OG sur toutes les pages

### Sécurité

- [ ] `npm run test` et `npx tsc --noEmit` passent
- [ ] Console navigateur sans erreur `Content-Security-Policy` sur `/`, `/devis` et `/admin`
      (le CSP dans `src/server.ts` autorise Supabase, Google Fonts et Plausible ; élargir
      `connect-src`/`img-src`/`script-src` si un nouveau domaine externe est ajouté)
- [ ] `check-auth-settings.mjs` confirme l'inscription publique désactivée

## Statut attendu après configuration

**READY AFTER CONFIGURATION** — le code est prêt ; la mise en ligne dépend des env, données légales et migration Supabase.
