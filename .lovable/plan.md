# Tableau de bord CRM avec KPI et graphiques

Ajout d'une vue « Tableau de bord » dans l'espace `/admin`, au-dessus du pipeline existant, pour suivre l'activité commerciale en temps réel.

## Organisation de l'écran

Deux onglets en haut du CRM :

- **Tableau de bord** — les KPI et les graphiques (nouveau)
- **Pipeline** — la vue actuelle (filtres, Kanban, fiches leads), inchangée

Un sélecteur de période s'applique à tout le tableau de bord : 7 jours, 30 jours, 90 jours, 12 mois, tout.

## Indicateurs (bandeau de cartes)

- Demandes reçues sur la période, avec variation en % par rapport à la période précédente
- Demandes urgentes non traitées
- Devis demandés / envoyés
- Affaires gagnées
- Taux de conversion (gagnées ÷ total) et taux de perte
- Délai moyen entre la réception d'une demande et son passage en « contacté »

## Graphiques

1. **Évolution des demandes** — courbe des demandes par jour (ou par mois sur 12 mois), avec une seconde courbe des affaires gagnées.
2. **Devis par zone** — barres horizontales par ville/zone (Paris, Perpignan, Troyes, Dijon, autres), classées par volume, avec le taux de conversion de chaque zone.
3. **Répartition par statut** — donut du pipeline (nouveau, contacté, qualifié, devis demandé, devis envoyé, gagné, perdu).
4. **Entonnoir de conversion** — barres décroissantes : reçues → contactées → qualifiées → devis envoyés → gagnées, avec le pourcentage de passage à chaque étape.
5. **Type d'établissement** — barres par type de client (restaurant, boulangerie, collectivité…) pour voir les segments porteurs.
6. **Origine des demandes** — répartition par source / page d'atterrissage (UTM, page service ou zone d'origine).

## Temps réel

Les données se rafraîchissent automatiquement à l'arrivée d'un nouveau lead ou d'un changement de statut, via l'abonnement temps réel de la base sur la table des demandes. Un indicateur « en direct » et l'horodatage de la dernière mise à jour sont affichés. Le bouton « Actualiser » existant reste disponible.

## Détails techniques

- Nouveau composant `src/components/admin/DashboardOverview.tsx` + petits composants de graphiques ; `src/routes/admin.tsx` gagne les onglets et délègue.
- Graphiques avec `recharts` via le wrapper `@/components/ui/chart` déjà présent ; couleurs issues des tokens du design system (pas de couleurs en dur).
- Agrégations calculées côté client avec `useMemo` sur la requête `leads` déjà chargée (volume attendu faible), regroupement par jour/mois avec `date-fns`.
- Zone déterminée depuis `city` / `zone_source` du lead, rapprochée de `ZONES` dans `src/lib/site.ts` ; le reste tombe dans « Autres ».
- Temps réel : canal `postgres_changes` Supabase sur `public.leads`, qui invalide la clé de requête `["leads"]`. Lecture soumise aux policies staff existantes — aucune modification de schéma ni de RLS.
- États vides explicites lorsqu'aucune donnée n'existe sur la période, plutôt que des graphiques vides.
