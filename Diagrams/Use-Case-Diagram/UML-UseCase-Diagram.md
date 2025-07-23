# Diagramme de Cas d'Utilisation

Ce document présente les cas d'utilisation pour le système de messagerie sociale, décrivant les interactions entre les acteurs (Utilisateur, Administrateur) et le système.

## Description des Cas d'Utilisation

### Acteurs

- **Utilisateur**: Un membre standard de la plateforme.
- **Administrateur**: Un utilisateur avec des privilèges élevés pour la gestion et la modération de la plateforme.

### Cas d'Utilisation

#### Accès Public

- **S'inscrire / Se connecter**: Permet à un visiteur de créer un compte ou de se connecter.

#### Gestion du Compte

- **Gérer son profil**: Permet à un utilisateur de mettre à jour ses informations personnelles.
- **Gérer son portfolio**: Permet à un utilisateur de gérer son portfolio professionnel.

#### Gestion de Contenu

- **Créer et gérer un post**: Permet à un utilisateur de publier, modifier ou supprimer ses propres posts.
- **Commenter un post**: Permet à un utilisateur de commenter les posts.
- **Tagger un post**: Permet à un utilisateur d'ajouter des tags à un post.
- **Recevoir des notifications**: L'utilisateur reçoit des notifications pour les interactions pertinentes.

#### Interactions Sociales

- **Envoyer un message privé**: Permet aux utilisateurs de communiquer en privé.
- **Suivre un utilisateur**: Permet à un utilisateur de suivre les activités d'un autre.
- **Créer/Rejoindre un groupe**: Permet aux utilisateurs de former des communautés.

#### Signalement et Modération

- **Signaler un contenu**: Permet à un utilisateur de signaler un contenu qu'il juge inapproprié.
- **Gérer les signalements**: Permet à un administrateur de voir et de traiter les contenus signalés.
- **Supprimer un contenu inapproprié**: (Extension) L'administrateur peut supprimer un contenu suite à un signalement.
- **Bloquer un utilisateur**: (Extension) L'administrateur peut bloquer un utilisateur suite à un signalement ou un comportement abusif.

#### Administration

- **Gérer les comptes utilisateurs**: Permet à un administrateur de gérer les comptes des utilisateurs (activer, désactiver, etc.).
- **Consulter les statistiques**: Permet à un administrateur de visualiser les statistiques d'utilisation de la plateforme.
