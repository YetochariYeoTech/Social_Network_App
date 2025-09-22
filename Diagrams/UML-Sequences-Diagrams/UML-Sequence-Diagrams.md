# Explication des Diagrammes de Séquence

## Qu'est-ce qu'un Diagramme de Séquence ?

Un diagramme de séquence est un outil de modélisation qui permet de visualiser les interactions entre les différents objets ou composants d'un système au fil du temps. Il montre, dans un ordre chronologique, les messages qui sont échangés entre les objets pour réaliser une fonctionnalité spécifique.

En d'autres termes, il raconte une histoire : celle de la manière dont les différentes parties de l'application collaborent pour accomplir une tâche. C'est un excellent moyen de comprendre le fonctionnement interne d'une fonctionnalité, de l'action de l'utilisateur jusqu'à la réponse du système.

## Illustrations des Diagrammes de Séquence

### 1. Envoi d'un Message (Message-Sending)

Ce diagramme illustre le processus d'envoi d'un message d'un utilisateur à un autre. La séquence est la suivante :

1.  L'utilisateur A (l'expéditeur) saisit son message dans l'interface utilisateur et clique sur "Envoyer".
2.  L'interface envoie une requête au serveur pour envoyer le message.
3.  Le serveur reçoit la requête, la valide et enregistre le message dans la base de données.
4.  Une fois le message enregistré, le serveur envoie une notification en temps réel (via un socket) à l'utilisateur B (le destinataire).
5.  L'interface de l'utilisateur B reçoit la notification et affiche le nouveau message.

### 2. Inscription d'un Utilisateur (User-Registration)

Ce diagramme montre les étapes de la création d'un nouveau compte utilisateur :

1.  Le visiteur remplit le formulaire d'inscription (nom, e-mail, mot de passe) et le soumet.
2.  L'interface envoie les données d'inscription au serveur.
3.  Le serveur vérifie si l'e-mail n'est pas déjà utilisé et si les données sont valides.
4.  Si tout est en ordre, le serveur crée un nouvel utilisateur dans la base de données.
5.  Le serveur renvoie une réponse de succès à l'interface, qui redirige l'utilisateur vers la page de connexion ou son nouveau profil.

### 3. Création d'une Publication (Post-Creation)

Ce diagramme détaille comment un utilisateur crée une nouvelle publication :

1.  L'utilisateur rédige sa publication et la soumet.
2.  L'interface envoie le contenu de la publication au serveur.
3.  Le serveur enregistre la nouvelle publication dans la base de données, en l'associant à l'utilisateur qui l'a créée.
4.  Le serveur renvoie une confirmation à l'interface.
5.  L'interface met à jour le fil d'actualité de l'utilisateur pour afficher la nouvelle publication.

### 4. Suivre un Utilisateur (User-Following)

Ce diagramme explique le processus permettant à un utilisateur d'en suivre un autre :

1.  L'utilisateur A clique sur le bouton "Suivre" sur le profil de l'utilisateur B.
2.  L'interface envoie une requête au serveur pour établir la relation de suivi.
3.  Le serveur enregistre dans la base de données que l'utilisateur A suit désormais l'utilisateur B.
4.  Le serveur envoie une notification à l'utilisateur B pour l'informer qu'il a un nouvel abonné.
5.  L'interface de l'utilisateur A met à jour le bouton pour indiquer que le suivi est actif (par exemple, en affichant "Abonné").
