# Diagrammes d'Activité

## Qu'est-ce qu'un diagramme d'activité ?

Un diagramme d'activité est une représentation graphique d'un flux de travail ou d'un processus. Il fait partie du standard UML (Unified Modeling Language) et est utilisé pour modéliser les aspects dynamiques d'un système. Il met l'accent sur la séquence et les conditions de déclenchement des actions et des activités.

Les composants clés d'un diagramme d'activité incluent :
- **Actions :** Les étapes ou tâches individuelles dans le flux de travail.
- **Nœuds de décision :** Points où le chemin peut se diviser en fonction d'une condition (par exemple, un "si/alors").
- **Nœuds de fusion :** Points où les chemins alternatifs se rejoignent.
- **Nœuds de départ et de fin :** Indiquent le début et la fin du flux de travail.
- **Fourches (Forks) et jointures (Joins) :** Utilisés pour modéliser des activités parallèles.

Ces diagrammes sont particulièrement utiles pour comprendre les processus métier, les cas d'utilisation complexes et le déroulement logique des opérations dans une fonction ou un service.

---

## Description des Flux d'Activité

### 1. Inscription d'un Nouvel Utilisateur

Ce flux décrit le processus par lequel un visiteur devient un membre de l'application.

1.  **Début :** L'utilisateur clique sur le bouton "S'inscrire".
2.  **Action :** L'utilisateur remplit le formulaire d'inscription (nom d'utilisateur, email, mot de passe).
3.  **Action :** L'utilisateur soumet le formulaire.
4.  **Décision :** Le système valide les données. Les informations sont-elles valides et l'email n'est-il pas déjà utilisé ?
    - **[Non] :** Le système affiche un message d'erreur spécifique (par exemple, "Email déjà utilisé" ou "Mot de passe trop court"). Le flux retourne à l'étape de remplissage du formulaire.
    - **[Oui] :** Le système crée un nouvel enregistrement utilisateur dans la base de données avec un statut "en attente de validation".
5.  **Action :** Le système envoie un email de confirmation à l'adresse fournie.
6.  **Action :** L'utilisateur reçoit l'email et clique sur le lien de validation.
7.  **Action :** Le système met à jour le statut de l'utilisateur à "validé".
8.  **Fin :** Le processus d'inscription est terminé. L'utilisateur peut maintenant se connecter.

### 2. Création d'une Publication

Ce flux détaille comment un utilisateur authentifié peut créer et partager une nouvelle publication.

1.  **Début :** L'utilisateur clique sur l'icône "Créer une publication".
2.  **Action :** L'utilisateur saisit le contenu textuel de sa publication.
3.  **Action (Optionnelle) :** L'utilisateur ajoute des médias (images, vidéos) à sa publication.
4.  **Action :** L'utilisateur clique sur "Publier".
5.  **Action :** Le système reçoit la demande et enregistre la publication dans la base de données, en l'associant à l'ID de l'utilisateur.
6.  **Action :** Le système notifie les abonnés de l'utilisateur qu'une nouvelle publication a été ajoutée.
7.  **Action :** Le système met à jour le fil d'actualité de l'utilisateur et de ses abonnés pour inclure la nouvelle publication.
8.  **Fin :** La publication est visible.

### 3. Suivre un Autre Utilisateur

Ce flux décrit comment un utilisateur peut s'abonner aux publications d'un autre utilisateur.

1.  **Début :** L'utilisateur navigue vers le profil d'un autre utilisateur.
2.  **Action :** L'utilisateur clique sur le bouton "Suivre".
3.  **Décision :** Le système vérifie si une relation de suivi existe déjà.
    - **[Oui] :** (Cas d'un "Ne plus suivre") Le système supprime la relation de la base de données. Le bouton se met à jour pour afficher "Suivre".
    - **[Non] :** Le système crée une nouvelle entrée dans la table des suivis, liant les deux utilisateurs.
4.  **Action :** Le système envoie une notification à l'utilisateur qui vient d'être suivi.
5.  **Action :** Le bouton sur l'interface se met à jour pour afficher "Ne plus suivre".
6.  **Fin :** L'utilisateur suit maintenant l'autre utilisateur.

### 4. Aimer une Publication

Ce flux montre le processus simple pour un utilisateur d'aimer une publication.

1.  **Début :** L'utilisateur voit une publication dans son fil d'actualité.
2.  **Action :** L'utilisateur clique sur l'icône "J'aime" (par exemple, un cœur).
3.  **Décision :** Le système vérifie si l'utilisateur a déjà aimé cette publication.
    - **[Oui] :** Le système supprime le "j'aime" de la base de données (unlike). Le compteur de "j'aime" est décrémenté.
    - **[Non] :** Le système enregistre le "j'aime" dans la base de données, l'associant à l'utilisateur et à la publication. Le compteur de "j'aime" est incrémenté.
4.  **Action (si "J'aime" a été ajouté) :** Le système envoie une notification à l'auteur de la publication.
5.  **Action :** L'interface est mise à jour pour refléter l'état actuel (par exemple, l'icône change de couleur).
6.  **Fin :** L'action est terminée.

### 5. Envoi d'un Message Privé

Ce flux décrit l'envoi d'un message d'un utilisateur à un autre.

1.  **Début :** L'utilisateur ouvre une conversation avec un autre utilisateur depuis la section de messagerie.
2.  **Action :** L'utilisateur tape son message dans le champ de saisie.
3.  **Action :** L'utilisateur appuie sur le bouton "Envoyer".
4.  **Action :** Le système enregistre le message dans la base de données, en l'associant à la conversation, à l'expéditeur et au destinataire.
5.  **Action :** Le système transmet le message en temps réel au destinataire via une connexion WebSocket.
6.  **Action :** L'interface de l'expéditeur est mise à jour pour afficher le message comme envoyé.
7.  **Décision :** Le destinataire est-il en ligne et la conversation est-elle ouverte ?
    - **[Oui] :** L'interface du destinataire est mise à jour instantanément avec le nouveau message.
    - **[Non] :** Le message est stocké et sera affiché comme "non lu" la prochaine fois que le destinataire ouvrira la conversation.
8.  **Fin :** Le message est envoyé.