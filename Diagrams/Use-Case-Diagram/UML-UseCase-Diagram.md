# Description du Diagramme de Cas d'Utilisation

Ce document décrit les différentes interactions possibles entre les acteurs (Utilisateur, Administrateur) et le système de messagerie sociale. Il est structuré en paquets fonctionnels pour clarifier les responsabilités et les fonctionnalités.

## Acteurs

1.  **Utilisateur** : Le participant principal du réseau social. Il peut créer du contenu, interagir avec d'autres utilisateurs et gérer son propre compte.
2.  **Administrateur** : Un utilisateur avec des privilèges élevés, responsable de la modération du contenu et de la gestion de la plateforme.

## Paquets de Cas d'Utilisation

### Accès Public

*   **S'inscrire / Se connecter** : Permet à un visiteur de créer un nouveau compte ou de se connecter à un compte existant. C'est le point d'entrée pour tous les utilisateurs.

### Gestion du Compte

*   **Gérer son profil** : Permet à un utilisateur de modifier ses informations personnelles (nom, photo de profil, biographie, etc.).
*   **Gérer son portfolio** : Permet à un utilisateur de mettre en valeur ses projets ou réalisations.

### Gestion de Contenu

*   **Créer et gérer un post** : L'utilisateur peut publier du contenu (texte, images), le modifier ou le supprimer.
*   **Commenter un post** : L'utilisateur peut ajouter des commentaires sur les posts des autres.
*   **Tagger un post** : Permet de catégoriser le contenu avec des mots-clés pour en faciliter la découverte.
*   **Recevoir des notifications** : Le système informe l'utilisateur des interactions pertinentes (nouveaux commentaires, likes, etc.).

### Signalement et Modération

Ce paquet gère le cycle de vie du contenu problématique.

*   **Signaler un contenu** : Un utilisateur peut marquer un post ou un commentaire comme étant inapproprié.
*   **Gérer le contenu signalé** : Un administrateur examine les contenus signalés. Ce cas d'utilisation est étendu par les actions suivantes :
    *   **Supprimer un contenu (`<<extend>>`)** : Si le contenu enfreint les règles, l'administrateur le supprime.
    *   **Ignorer le signalement (`<<extend>>`)** : Si le contenu est jugé approprié, l'administrateur rejette le signalement.

### Interactions Sociales

*   **Envoyer un message privé** : Communication directe et privée entre utilisateurs.
*   **Suivre un utilisateur** : Permet de s'abonner aux publications d'un autre utilisateur.
*   **Créer/Rejoindre un groupe** : Fonctionnalité de discussion en communauté autour d'un intérêt commun.

### Administration

Ce paquet regroupe les tâches de gestion de la plateforme réservées à l'administrateur.

*   **Gérer les comptes utilisateurs** : L'administrateur peut superviser les comptes des utilisateurs. Ce cas est étendu par :
    *   **Bloquer un utilisateur (`<<extend>>`)** : Empêche définitivement un utilisateur d'accéder à la plateforme.
    *   **Suspendre un utilisateur (`<<extend>>`)** : Bloque temporairement l'accès d'un utilisateur.
*   **Consulter les statistiques** : Permet à l'administrateur de visualiser des données sur l'activité de la plateforme.

### Note sur l'Authentification

À l'exception de "S'inscrire / Se connecter", toutes les actions nécessitent que l'utilisateur soit authentifié. Le cas d'utilisation **S'authentifier** est donc implicitement inclus dans tous les autres cas d'utilisation restreints.
