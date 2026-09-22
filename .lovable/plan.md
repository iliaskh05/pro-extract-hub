# Audit et amélioration de l’accessibilité

## Objectif
Rendre toutes les pages publiques et le CRM plus accessibles au clavier, aux lecteurs d’écran et aux personnes ayant une vision réduite, sans changer les parcours ni les fonctions métier.

## Travaux prévus

### Navigation et structure
- Vérifier les titres, régions de page, lien d’évitement et ordre de lecture sur chaque page.
- Renforcer le focus visible sur les liens, boutons et contrôles.
- Corriger le menu mobile pour gérer le focus à l’ouverture, la fermeture avec Échap et le retour au bouton d’origine.
- Empêcher le clavier d’atteindre le contenu derrière les panneaux et fenêtres ouverts.

### Formulaires et messages
- Relier chaque erreur au champ concerné avec une description accessible.
- Annoncer les changements d’étape, erreurs, chargements, envois et confirmations aux lecteurs d’écran.
- Déplacer automatiquement le focus vers le titre de l’étape ou la première erreur utile.
- Donner des libellés explicites aux filtres du CRM, zones de notes et boutons de sélection.
- Améliorer les champs de photos avec noms, état du fichier et retours d’erreur accessibles.

### Composants interactifs
- Donner aux choix visuels les états appropriés (`aria-pressed`, groupes nommés et état sélectionné).
- Compléter les relations question/réponse de la FAQ.
- Rendre le chat et WhatsApp utilisables comme de vraies fenêtres accessibles : titre, description, focus, fermeture et annonces de nouveaux messages.
- Rendre les lignes du tableau CRM accessibles au clavier sans transformer les lignes en contrôles non standards.
- Ajouter des alternatives textuelles aux graphiques et états dynamiques du tableau de bord.

### Contrastes et mouvement
- Mesurer les combinaisons de couleurs réellement utilisées et corriger uniquement celles sous WCAG AA.
- Vérifier les textes secondaires, badges, états désactivés et contenus sur fonds sombres.
- Étendre la réduction des animations lorsque le système demande moins de mouvement.

### Validation
- Parcourir toutes les pages au clavier sur ordinateur et mobile.
- Lancer un audit automatisé d’accessibilité sur chaque route publique et sur l’écran de connexion CRM.
- Vérifier les formulaires, le menu, la FAQ, les fenêtres et le comparateur avec des scénarios ciblés.
- Confirmer l’absence d’erreurs de compilation et de fonctionnement après les corrections.

## Détails techniques
- Conserver les composants et styles existants ; privilégier les primitives accessibles déjà présentes.
- Ajouter des identifiants stables pour `aria-describedby`, `aria-controls` et les régions d’annonce.
- Utiliser des tableaux sémantiques, légendes textuelles et résumés masqués pour les données visuelles.
- Ne modifier ni le stockage des devis, ni le CRM, ni les règles d’accès.
