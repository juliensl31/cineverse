# Projet Passerelle #4 (CineVerse)

Ce projet est une application web qui permet de rechercher des films, séries ou artistes, et d'obtenir des informations détaillées sur chacun d'eux pour les passionnés de cinéma.
Utilise l'API de The Movie Database (TMDB) pour récupérer les données.
Redirection vers Wikipedia pour les détails des films, séries et artistes complémentaires.

## Technologies utilisées

- React / Next.js
- Tailwind CSS
- Firebase
  
## Description du projet

- Une page d'accueil avec …
  - un menu de navigation pour accéder aux films, aux séries et à une page de connexion/inscription.
  - un champ de recherche pour rechercher des films, séries et personnages.
  - les derniers films à l'affiche et les séries à l'affiche avec un bouton "voir plus" pour accéder à la page des films et des séries.
  - un footer avec le copyright.

- Une page de films et une page de séries avec …
  - un menu de navigation pour accéder aux films ou aux séries en fonction de la page ou on se trouve, retour à la page d'accueil, un retour en arrière et toujours un lien pour accéder à la page de connexion/inscription.
  - un système de filtres pour filtrer les films ou séries par genre et par année.
  - un système de pagination pour naviguer entre les pages de films ou séries.
  - un système de recherche pour rechercher des films ou séries par titre.
  - les films ou séries sont affichés avec leur affiche, leur titre, leur année de sortie, leur note et l'age approprié.

- Une page de détails pour les films et les séries et artistes avec …
  - la navigation
  - les détails du film ou de la série avec leur affiche, leur titre, leur année de sortie, leur note, l'age approprié, leur synopsis, leur durée, leur genre, leur bande annonce, l'équipe technique, la distribution, les informations budget et recette ainsi qu'une liste de recommandations de films et séries similaires.
  - les détails de l'artiste avec leur photo, leur nom, leur date de naissance,leur age, leur date de décès (si applicable),leur lieu de naissance, leur biographie, leurs films et séries les plus populaires ainsi que leurs réseaux sociaux.
  - un lien vers la page de détails du film, de la série ou de l'artiste sur Wikipedia (si disponible).
  - un système de partage.

- Une page de connexion/inscription avec …
  - un formulaire de connexion avec un champ pour l'email, un champ pour le mot de passe et un bouton pour se connecter
  - un formulaire d'inscription avec un champ pour le nom, un champ pour l'email, un champ pour le mot de passe,un champ pour la confirmation du mot de passe, un bouton pour s'inscrire avec contrôle de validité des champs.

- Une page de profil si l'utilisateur est connecté avec …
  - les informations du profil avec leur nom, leur email.
  - une section pour les favoris avec les films et séries favoris.
  - une section pour les films et séries vus.

Si l'utilisateur est connecté, la navigation est modifiée pour permettre l'accès à la page de profil et de déconnexion.

## Fonctionnalités non implémentées

- La fonctionnalité de favoris.
- La fonctionnalité de films et séries vus.
- La fonctionnalité de recherche avancée.
- Modification des informations du profil.

## Utilisation

- Cloner le repository
- Installer les dépendances avec `npm install`
- Lancer le projet avec `npm start`

***Bienvenue dans le CineVerse, votre portail vers le Cinéma !!***
