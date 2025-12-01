            DinoCool — Jeu de course façon Chrome Dino

DinoCool est un jeu web inspiré du célèbre jeu du dinosaure de Google Chrome.
Le joueur contrôle un personnage capable de sauter et s'accroupir pour éviter les obstacles tout en accumulant un score basé sur le temps de survie.
Le projet est entièrement réalisé en HTML / CSS / JavaScript et fonctionne directement dans le navigateur.

    Technologies utilisées

HTML5 — Structure de la page et des éléments du jeu

CSS3 — Styles, animations, mise en page, effets visuels

JavaScript — Gestion du gameplay, physique, collisions, boucle de jeu

DOM Manipulation — Création dynamique des entités

requestAnimationFrame — Mise à jour fluide du jeu

Git / GitHub — Controle de version

    Fonctionnalités principales

Gestion du saut du joueur avec vélocité et gravité

Animation du joueur avec un rotation jump

Boucle de jeu limitée à 144 FPS pour un rendu fluide

Système de score dynamique basé sur le temps

Détection de collisions player / sol

Génération dynamique des éléments (ex: sol)

Transition du menu → gameplay

Adaptation automatique aux changements de taille de fenêtre ou zoom

    Lien vers la page GitHub Pages

https://chihebbhy.github.io/ChihebBenHadjYahia_DinoCool/

    Nouveautés explorées

Durant ce projet, j’ai appris et expérimenté plusieurs concepts :

  Javascript & Game Dev

Implémentation d’une boucle de jeu avec contrôle du framerate

Utilisation de requestAnimationFrame pour un rendu optimisé

Calculs physiques : gravité, vélocité, temps (dt)

Gestion de collisions via positions absolues du DOM

Système d’entités dynamiques via classes JavaScript

  CSS & animations

Animations CSS (transform, transition)

Utilisation de classes dynamiques pour animer les sprites

Mise en page responsive malgré les éléments absolus

  Git 

Utilisation de git add, commit, push

Revenir à une version précédente

Organisation d’un projet web complet dans GitHub

    Difficultés rencontrées

Voici les principaux problèmes rencontrés pendant le développement :

  Problème 1 : Le joueur ne détectait pas correctement le sol

La hitbox pouvait se décaler lors du zoom ou du resize.

  Problème 2 : Les FPS dépassaient 144 FPS

Le jeu tournait trop vite sur certains écrans 144Hz.

  Problème 3 : L’animation du sol ne s’étendait pas correctement

La width ne se mettait pas à jour après la transition.

  Problème 4 : Les erreurs liées au DOM lors de la création des entités

Certaines entités étaient créées dans le mauvais conteneur.

    Solutions apportées

  Hitbox et position du joueur

Recalcul automatique des positions avec Player.reload()

Ajout d’un listener resize pour éviter les bugs lors du zoom

  Limitation des FPS

Mise en place d’un contrôle via un interval fixé (144 FPS)

  Animation du sol

Utilisation d’une classe CSS temporaire pour étendre proprement le sol

  Placement des entités

Ajustement de la fonction CreateEntity() pour placer chaque élément dans le bon conteneur

    Conclusion

DinoCool m’a permis de découvrir la logique d’un vrai moteur de jeu minimaliste :

Optimisation FPS

C’était un projet très complet et formateur.
