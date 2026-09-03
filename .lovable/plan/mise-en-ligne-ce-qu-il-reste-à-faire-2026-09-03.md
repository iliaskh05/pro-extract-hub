# Mise en ligne — ce qu'il reste à faire

Analyse de l'état actuel du projet et liste des actions restantes avant publication.

## Ce qui est déjà prêt

- Build sans erreur, typecheck propre, toutes les pages publiques et le CRM `/admin` fonctionnent.
- SEO technique en place : `head()` sur chaque route, sitemap et robots avec URLs absolues, JSON-LD, OG/Twitter.
- Formulaire de devis 5 étapes → enregistrement en base, upload photos sécurisé par token HMAC.
- Sécurité base de données : RLS active, accès aux leads réservé aux rôles staff/admin.

## Bloquants (impossible de publier proprement sans)

1. **Aucun accès CRM configuré** — la table des rôles est vide (0 ligne) alors que 2 comptes existent. Personne ne peut ouvrir `/admin` aujourd'hui. Il faut attribuer le rôle `admin` au compte de la direction.
2. **Coordonnées de l'entreprise manquantes** — `src/lib/site.ts` contient encore des champs vides : dénomination légale, forme juridique, adresse du siège, SIRET/SIREN/TVA, téléphone, email, horaires, hébergeur, directeur de publication, comptes sociaux. Ces valeurs alimentent le header, le footer, la page contact, les mentions légales, la confidentialité et le JSON-LD. Elles ne peuvent pas être inventées.
3. **Mentions légales et politique de confidentialité incomplètes** — elles dépendent des données ci-dessus et doivent être relues juridiquement (RGPD : finalité, durée de conservation, sous-traitants).

## Important (à faire avant ou juste après la mise en ligne)

4. **Emails transactionnels** — aucune clé Resend configurée : à la soumission d'un devis, aucun email n'est envoyé (le lead est bien enregistré). Il faut `RESEND_API_KEY`, `RESEND_FROM` (domaine vérifié) et `LEAD_NOTIFY_EMAIL`.
5. **Assistant chat** — la clé Lovable AI est présente, donc le chat fonctionne. À valider en conditions réelles et à cadrer sur le discours commercial.
6. **WhatsApp** — `VITE_WHATSAPP_NUMBER` non défini : le bouton WhatsApp est masqué partout.
7. **Photos réelles** — les visuels avant/après sont des images de démonstration explicitement marquées. À remplacer par des interventions réelles dès disponibilité (crédibilité commerciale forte).
8. **Domaine définitif** — le site pointe sur `pro-extract-hub.lovable.app`. Une fois le domaine acheté et connecté : mettre à jour `VITE_SITE_URL`, régénérer sitemap/robots, réaligner canonical et OG.
9. **Google Search Console** — non connecté. À faire après la mise en ligne sur le domaine final.
10. **Analytics** — `VITE_PLAUSIBLE_DOMAIN` vide ; le bandeau cookies existe déjà mais ne charge rien.

## Confort / finitions

- Rayon d'intervention réel autour de Paris, Perpignan, Troyes et Dijon à préciser dans les pages zones.
- Grille tarifaire : vérifier que la page `/tarifs` correspond à la politique commerciale réelle.
- Test de bout en bout sur mobile réel (sticky CTA, formulaire, chat).

## Détails techniques

- Rôles : insertion d'une ligne dans `public.user_roles` (`user_id`, `role = 'admin'`) pour le compte cible ; les policies `has_role` / `is_staff` sont déjà en place.
- Variables serveur (jamais en `VITE_*`) : `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_NOTIFY_EMAIL`.
- Variables publiques : `VITE_SITE_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_PLAUSIBLE_DOMAIN`.
- Données entreprise centralisées dans `src/lib/site.ts` — une seule édition propage partout.

## Ordre d'exécution proposé

1. Attribuer le rôle admin (immédiat, je peux le faire si tu me donnes l'email du compte).
2. Intégrer les coordonnées entreprise dans `src/lib/site.ts` + relecture des pages légales.
3. Configurer Resend et le numéro WhatsApp, tester un devis complet.
4. Connecter le domaine, mettre à jour `VITE_SITE_URL`, régénérer le SEO, publier.
5. Google Search Console + analytics, puis remplacement des photos de démonstration.
