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
| `SUPABASE_SERVICE_ROLE_KEY`     | Oui         | Devis, uploads, emails (jamais en `VITE_*`)            |
| `RESEND_API_KEY`                | Recommandé  | Notifications email                                    |
| `RESEND_FROM`                   | Recommandé  | Expéditeur (domaine vérifié Resend)                    |
| `LEAD_NOTIFY_EMAIL`             | Recommandé  | Email interne nouvelles demandes                       |
| `VITE_WHATSAPP_NUMBER`          | Recommandé  | Format `33612345678`                                   |
| `VITE_PLAUSIBLE_DOMAIN`         | Optionnel   | Analytics (après consentement cookies)                 |
| `OPENAI_API_KEY`                | Optionnel   | Assistant chat (fallback règles sinon)                 |

## Données entreprise

Renseigner dans `src/lib/site.ts` : téléphone, email, SIRET, adresse, réseaux sociaux, hébergeur.

## Supabase

1. Appliquer les migrations dans l'ordre :
   - `20260816125108_*.sql`
   - `20260823170000_production_readiness.sql`
   - `20260828180000_lead_qualification.sql`
2. Désactiver l'inscription publique Auth.
3. Créer un utilisateur staff + entrée `staff_profiles` (rôle `admin`).
4. Vérifier le bucket `lead-documents` et les policies RLS.

## Resend

1. Vérifier le domaine d'envoi.
2. Tester : soumission devis → email interne + confirmation client.

## WhatsApp

Configurer `VITE_WHATSAPP_NUMBER` et tester header, sticky mobile, chat, page contact.

## OpenAI

Optionnel — l'assistant fonctionne sans clé (règles déterministes).

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

## Statut attendu après configuration

**READY AFTER CONFIGURATION** — le code est prêt ; la mise en ligne dépend des env, données légales et migration Supabase.
