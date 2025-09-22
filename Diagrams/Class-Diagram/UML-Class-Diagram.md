
# Explication du Diagramme de Classes

Ce document a pour but de fournir une explication détaillée du diagramme de classes de l'application. Il vise à clarifier la structure de la base de données et les relations entre les différentes entités.

## Présentation Générale

Le diagramme de classes représente les différentes "briques" de notre application. Chaque classe correspond à un modèle de données, c'est-à-dire à un type d'information que nous stockons. Par exemple, nous avons une classe `User` pour les utilisateurs, une classe `Post` pour les publications, etc.

Les liens entre les classes montrent comment ces informations sont connectées. Par exemple, un `User` peut créer plusieurs `Post`, et un `Post` peut avoir plusieurs `Comment`.

## Attributs Détaillés des Entités

Voici la liste complète des attributs pour chaque entité, avec une brève description de leur rôle.

### User

L'entité `User` représente un utilisateur de l'application.

- `email` (String, requis, unique) : L'adresse e-mail de l'utilisateur, utilisée pour la connexion.
- `fullName` (String, requis) : Le nom complet de l'utilisateur.
- `role` (String, enum: `STUDENT`, `TEACHER`, `STAFF`, `ADMIN`) : Le rôle de l'utilisateur dans l'application.
- `password` (String, requis) : Le mot de passe de l'utilisateur (haché).
- `bio` (String) : Une courte biographie de l'utilisateur.
- `location` (String) : La localisation de l'utilisateur.
- `likedPosts` (Array de `Post`) : La liste des publications que l'utilisateur a aimées.
- `blockedUsers` (Array de `User`) : La liste des utilisateurs que cet utilisateur a bloqués.
- `posts` (Array de `Post`) : La liste des publications créées par l'utilisateur.
- `favoritePosts` (Array de `Post`) : La liste des publications que l'utilisateur a ajoutées à ses favoris.
- `profilePic` (String) : L'URL de la photo de profil de l'utilisateur.
- `portfolio` (ObjectId vers `Portfolio`) : Une référence vers le portfolio de l'utilisateur.
- `countFollowers` (Number) : Le nombre d'abonnés de l'utilisateur.
- `followers` (Array de `User`) : La liste des utilisateurs qui suivent cet utilisateur.
- `countFriends` (Number) : Le nombre d'amis de l'utilisateur.
- `friends` (Array de `User`) : La liste des amis de l'utilisateur.
- `notifications` (Array de `Notification`) : La liste de toutes les notifications de l'utilisateur.
- `unreadNotifications` (Array de `Notification`) : La liste des notifications non lues de l'utilisateur.
- `failedLoginAttempts` (Number) : Le nombre de tentatives de connexion échouées.
- `lockUntil` (Number) : L'horodatage jusqu'auquel le compte de l'utilisateur est verrouillé.

### Post

L'entité `Post` représente une publication faite par un utilisateur.

- `user` (ObjectId vers `User`, requis) : L'utilisateur qui a créé la publication.
- `description` (String) : Le contenu textuel de la publication.
- `attachmentType` (String, enum: `image`, `document`, `link`, `text`) : Le type de fichier joint à la publication.
- `attachment` (String) : L'URL du fichier joint.
- `originalFileName` (String) : Le nom original du fichier joint.
- `category` (String, enum) : La catégorie de la publication.
- `likes` (Array de `User`) : La liste des utilisateurs qui ont aimé la publication.
- `likesCount` (Number) : Le nombre de "j'aime" sur la publication.
- `comments` (Array de `Comment`) : La liste des commentaires sur la publication.
- `commentsCount` (Number) : Le nombre de commentaires sur la publication.

### Comment

L'entité `Comment` représente un commentaire fait par un utilisateur sur une publication.

- `user` (ObjectId vers `User`, requis) : L'utilisateur qui a écrit le commentaire.
- `post` (ObjectId vers `Post`, requis) : La publication sur laquelle le commentaire a été fait.
- `notification` (Array de `Notification`) : Les notifications liées à ce commentaire.
- `content` (String, requis) : Le contenu du commentaire.

### Message

L'entité `Message` représente un message privé envoyé d'un utilisateur à un autre.

- `senderId` (ObjectId vers `User`, requis) : L'expéditeur du message.
- `receiverId` (ObjectId vers `User`, requis) : Le destinataire du message.
- `text` (String) : Le contenu textuel du message.
- `image` (String) : Une image jointe au message.

### Notification

L'entité `Notification` représente une notification envoyée à un utilisateur.

- `recipient` (ObjectId vers `User`, requis) : Le destinataire de la notification.
- `sender` (ObjectId vers `User`, requis) : L'expéditeur de la notification.
- `type` (String, enum: `LIKE`, `COMMENT`, `FOLLOW`, `MESSAGE`, `EVENT`) : Le type de notification.
- `target` (ObjectId, requis) : L'objet cible de la notification (par exemple, un `Post` ou un `User`).
- `targetModel` (String, enum: `POST`, `USER`, `MESSAGE`, `EVENT`, `FOLLOW`, `GROUP`, `COMMENT`) : Le modèle de l'objet cible.
- `isRead` (Boolean) : Indique si la notification a été lue.

### Follow

L'entité `Follow` représente la relation d'abonnement entre deux utilisateurs.

- `follower` (ObjectId vers `User`, requis) : L'utilisateur qui suit.
- `following` (ObjectId vers `User`, requis) : L'utilisateur qui est suivi.
- `followBack` (Boolean) : Indique si l'utilisateur suivi a également suivi en retour.

### Event

L'entité `Event` représente un événement créé par un utilisateur.

- `title` (String, requis) : Le titre de l'événement.
- `description` (String, requis) : La description de l'événement.
- `startTime` (Date, requis) : La date et l'heure de début de l'événement.
- `endTime` (Date, requis) : La date et l'heure de fin de l'événement.
- `location` (String, requis) : Le lieu de l'événement.
- `creator` (ObjectId vers `User`, requis) : Le créateur de l'événement.
- `attendees` (Array de `User`) : La liste des utilisateurs qui participent à l'événement.

### Group

L'entité `Group` représente un groupe de discussion.

- `creator` (ObjectId, requis) : Le créateur du groupe.
- `members` (Array de ObjectId) : La liste des membres du groupe.
- `admins` (Array de ObjectId) : La liste des administrateateurs du groupe.
- `chat` (Array) : L'historique des messages du groupe.

### Tag

L'entité `Tag` représente un mot-clé ou une étiquette qui peut être associée à des publications.

- `title` (String, requis) : Le nom du tag.
- `posts` (Array de ObjectId) : La liste des publications associées à ce tag.

### Portfolio

L'entité `Portfolio` représente le portfolio professionnel d'un utilisateur.

- `user` (ObjectId vers `User`, requis, unique) : L'utilisateur à qui appartient le portfolio.
- `summary` (String) : Un résumé du profil de l'utilisateur.
- `contact` (Object) : Les informations de contact de l'utilisateur.
- `education` (Array) : La liste des formations de l'utilisateur.
- `projects` (Array) : La liste des projets de l'utilisateur.
- `experiences` (Array) : La liste des expériences professionnelles de l'utilisateur.
- `skills` (Array) : La liste des compétences de l'utilisateur.
- `hobbies` (Array) : La liste des centres d'intérêt de l'utilisateur.
