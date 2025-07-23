# Projet de Messagerie Sociale Fullstack

## 1. Vue d'ensemble

Ce projet est une application web complète de messagerie sociale conçue pour offrir une expérience utilisateur riche et interactive. Elle combine les fonctionnalités d'une plateforme de médias sociaux (posts, commentaires, suivis) avec une messagerie instantanée en temps réel. L'objectif est de créer un système robuste, scalable et sécurisé, capable de gérer des interactions complexes et des communications en direct.

La conception du projet repose sur une séparation claire des responsabilités entre le frontend, le backend et la base de données, orchestrée par une architecture modulaire et résiliente.

## 2. Justification par les Diagrammes UML

Les diagrammes UML sont au cœur de la conception de ce projet. Ils ne sont pas de simples illustrations, mais des plans qui définissent la structure, le comportement et les interactions au sein du système.

### 2.1. Diagramme de Cas d'Utilisation : Définir le "Quoi ?"

Le [diagramme de cas d'utilisation](./Diagrams/Use-Case-Diagram/UML-UseCase-Diagram.md) définit les fonctionnalités du point de vue des acteurs : l'**Utilisateur** et l'**Administrateur**. Il répond à la question : **"Que peut-on faire avec le système ?"**

Ce diagramme a été crucial pour délimiter le périmètre fonctionnel de l'application avant même d'écrire une seule ligne de code.

### 2.2. Diagramme d'Architecture : Définir le "Comment ?"

Le [diagramme d'architecture](./Diagrams/Architecture-Diagram/Architecture-Generale.md) répond à la question : **"Comment le système est-il construit pour réaliser ces fonctionnalités ?"**

Il expose une architecture multi-tiers conçue pour la performance et la résilience, incluant un **MongoDB Replica Set** pour garantir la haute disponibilité et la durabilité des données.

Ensemble, ces deux diagrammes fournissent une vision complète et cohérente du projet, du besoin fonctionnel à la solution technique implémentée.

## 3. Technologies Utilisées

-   **Backend**: Node.js, Express.js, Socket.IO
-   **Frontend**: React, Vite, Tailwind CSS
-   **Base de Données**: MongoDB (configurée en Replica Set)
-   **Reverse Proxy**: NGINX
-   **Authentification**: JSON Web Tokens (JWT)

## 4. Endpoints de l'API

Voici la liste détaillée des routes de l'API, organisées par modèle de données.

### User Model
*   `POST /api/auth/signup`: Créer un nouvel utilisateur.
*   `POST /api/auth/login`: Connecter un utilisateur.
*   `POST /api/auth/logout`: Déconnecter un utilisateur.
*   `PUT /api/auth/update-profile`: Mettre à jour le profil d'un utilisateur.
*   `GET /api/auth/check`: Vérifier si un utilisateur est authentifié.
*   `GET /api/messages/users`: Obtenir tous les utilisateurs pour la barre latérale de messagerie.

### Post Model
*   `POST /api/posts/createPost`: Créer un nouveau post.
*   `GET /api/posts`: Obtenir tous les posts.
*   `DELETE /api/posts/deletePost/:postId`: Supprimer un post.
*   `POST /api/posts/actions/favorites/:postId`: Ajouter un post aux favoris.
*   `DELETE /api/posts/actions/favorites/:postId`: Retirer un post des favoris.
*   `POST /api/posts/actions/likes/:postId`: Aimer un post.
*   `DELETE /api/posts/actions/likes/:postId`: Ne plus aimer un post.

### Comment Model
*   `POST /api/posts/actions/:postId/comments`: Créer un nouveau commentaire.
*   `GET /api/posts/actions/:postId/comments`: Obtenir tous les commentaires d'un post.
*   `DELETE /api/posts/actions/comments/:commentId`: Supprimer un commentaire.

### Message Model
*   `GET /api/messages/:id`: Obtenir tous les messages d'une conversation.
*   `POST /api/messages/send/:id`: Envoyer un message.

### Notification Model
*   `GET /api/notifications`: Obtenir toutes les notifications d'un utilisateur.
*   `POST /api/notifications`: Créer une notification.
*   `PUT /api/notifications/:notificationId/read`: Marquer une notification comme lue.
*   `DELETE /api/notifications/:notificationId`: Supprimer une notification.

### Event Model
*   `POST /api/events`: Créer un nouvel événement.
*   `GET /api/events`: Obtenir tous les événements.
*   `GET /api/events/:eventId`: Obtenir un événement par son ID.
*   `PUT /api/events/:eventId`: Mettre à jour un événement.
*   `DELETE /api/events/:eventId`: Supprimer un événement.
*   `POST /api/events/:eventId/rsvp`: S'inscrire à un événement.

### Follow Model
*   `POST /api/follows`: Suivre un utilisateur.
*   `DELETE /api/follows/:followingId`: Ne plus suivre un utilisateur.
*   `GET /api/follows/:userId/followers`: Obtenir les abonnés d'un utilisateur.
*   `GET /api/follows/:userId/following`: Obtenir les abonnements d'un utilisateur.

### Group Model
*   `POST /api/groups`: Créer un nouveau groupe.
*   `GET /api/groups`: Obtenir tous les groupes.
*   `GET /api/groups/:groupId`: Obtenir un groupe par son ID.
*   `PUT /api/groups/:groupId`: Mettre à jour un groupe.
*   `DELETE /api/groups/:groupId`: Supprimer un groupe.
*   `POST /api/groups/:groupId/members`: Ajouter un membre à un groupe.
*   `DELETE /api/groups/:groupId/members/:memberId`: Retirer un membre d'un groupe.

### Portfolio Model
*   `GET /api/portfolios/:userId`: Obtenir le portfolio d'un utilisateur.
*   `PUT /api/portfolios`: Créer ou mettre à jour le portfolio d'un utilisateur.

### Tag Model
*   `POST /api/tags`: Créer un nouveau tag.
*   `GET /api/tags`: Obtenir tous les tags.
*   `GET /api/tags/:tagName/posts`: Obtenir tous les posts pour un tag donné.