# Explication du Diagramme de Cas d'Utilisation

Ce document a pour but d'expliquer le diagramme de cas d'utilisation du projet. Ce diagramme est essentiel car il définit le périmètre fonctionnel de l'application en identifiant les acteurs et les fonctionnalités clés qu'elle propose.

## Acteur Principal

L'unique acteur principal du système est l'**Utilisateur**.

- **Utilisateur** : Représente toute personne interagissant avec l'application pour utiliser ses fonctionnalités, qu'il soit simple visiteur ou membre authentifié.

## Cas d'Utilisation (Fonctionnalités)

Le diagramme modélise les fonctionnalités suivantes, qui représentent les services rendus par le système à l'utilisateur. Elles sont regroupées par catégorie pour plus de clarté.

### 1. Gestion de Compte

- **S'inscrire :** Permet à un nouvel utilisateur de créer un compte personnel.
- **Se Connecter / Se Déconnecter :** Permet à un utilisateur d'accéder à son compte pour utiliser les fonctionnalités réservées aux membres et de terminer sa session de manière sécurisée.
- **Mettre à jour son profil :** Permet à un utilisateur de modifier ses informations personnelles (nom, photo de profil, etc.).

### 2. Gestion des Publications

- **Créer une publication :** Permet à un utilisateur de partager du contenu (texte, images, etc.) visible par les autres.
- **Supprimer une publication :** Permet à un utilisateur de supprimer ses propres publications.
- **Voir les publications :** Permet à un utilisateur de consulter le fil d'actualité contenant les publications des autres utilisateurs.

### 3. Interactions Sociales

- **Aimer une publication :** Permet à un utilisateur de montrer son appréciation pour une publication.
- **Commenter une publication :** Permet à un utilisateur d'ajouter un commentaire à une publication pour engager la discussion.
- **Suivre un utilisateur :** Permet à un utilisateur de s'abonner aux publications d'un autre utilisateur pour ne rien manquer de son activité.

### 4. Messagerie

- **Envoyer un message privé :** Permet à un utilisateur d'envoyer un message direct à un autre utilisateur.
- **Consulter les messages :** Permet à un utilisateur de lire ses conversations privées.

## Relations

Dans le diagramme, l'acteur **Utilisateur** est directement lié à chacun de ces cas d'utilisation, indiquant qu'il a la capacité d'initier ces actions.

Certaines actions nécessitent une condition préalable. Par exemple, la plupart des cas d'utilisation (comme "Créer une publication") requièrent que l'utilisateur soit authentifié. Ceci est souvent modélisé comme une précondition ou via une relation `<<include>>` avec un cas d'utilisation "S'authentifier".

## Conclusion

En résumé, le diagramme de cas d'utilisation sert de "contrat fonctionnel" pour le projet. Il offre une vue d'ensemble claire et non technique de ce que le système doit faire, garantissant que le développement reste aligné sur les besoins des utilisateurs et les objectifs de l'application.
