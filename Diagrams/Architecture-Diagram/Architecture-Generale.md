# Architecture Technique Détaillée

## 1. Introduction

Ce document fournit une description détaillée de l'architecture technique de l'application de chat. L'architecture est conçue pour être **modulaire, sécurisée et scalable**, en séparant clairement les responsabilités entre le client, les services backend et la persistance des données. Un accent particulier est mis sur la **haute disponibilité** et la **durabilité des données** grâce à une base de données répliquée.

## 2. Description des Couches Architecturales

L'architecture est divisée en trois couches logiques distinctes.

### 2.1. Couche Client (Client Tier)

-   **Frontend (React)** : Une Single-Page Application (SPA) responsable de toute la logique de présentation et de la communication avec la couche serveur.

### 2.2. Couche Serveur (Server Tier)

-   **NGINX (Reverse Proxy)** : Point d'entrée unique pour tout le trafic, routant les requêtes, gérant le SSL et servant les assets statiques.

-   **Services Applicatifs** :
    -   **Module d'Authentification (JWT)** : Middleware de sécurité qui valide les jetons JWT pour protéger l'API.
    -   **API Backend (Node.js/Express)** : Cœur de l'application, gérant la logique métier et les interactions avec la base de données.
    -   **Serveur Temps Réel (Socket.IO)** : Gère les connexions WebSocket pour la diffusion d'événements en temps réel.

### 2.3. Couche de Persistance (Data Tier)

Cette couche est conçue pour la haute disponibilité et la tolérance aux pannes.

-   **MongoDB (Replica Set)** : La persistance des données est assurée par un cluster MongoDB configuré en **Replica Set**. Cette configuration comprend :
    -   Un nœud **Primaire** : qui reçoit toutes les opérations d'écriture.
    -   Plusieurs nœuds **Secondaires (Replicas)** : qui maintiennent une copie des données du primaire. 

    Cette approche garantit la **haute disponibilité** : en cas de défaillance du nœud primaire, une élection automatique a lieu et l'un des replicas est promu comme nouveau primaire, minimisant ainsi l'interruption de service. Elle assure également la **durabilité des données** en les distribuant sur plusieurs serveurs.

## 3. Flux de Données : Scénarios Clés

### 3.1. Scénario : Envoi d'un message

1.  **Action Utilisateur** : L'utilisateur authentifié soumet un message via l'interface React.
2.  **Requête Client** : Le client envoie une requête `POST /api/messages` avec le jeton JWT.
3.  **Routage & Auth** : NGINX route la requête vers le module d'authentification, qui valide le jeton.
4.  **Traitement API & Écriture Primaire** : L'API Backend reçoit la requête. La logique métier est exécutée et le message est écrit sur le nœud **primaire** du Replica Set MongoDB.
5.  **Réplication des Données** : MongoDB réplique automatiquement l'écriture du nœud primaire vers tous les nœuds secondaires de manière asynchrone.
6.  **Notification Temps Réel** : Après confirmation de l'écriture, l'API Backend notifie le serveur Socket.IO.
7.  **Diffusion** : Le serveur Socket.IO diffuse le nouveau message à tous les clients concernés.
8.  **Mise à Jour de l'UI** : Les clients reçoivent le message et mettent à jour leur interface.
