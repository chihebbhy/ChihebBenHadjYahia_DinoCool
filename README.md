# DinoCool — Jeu de course façon Chrome Dino 🦖

**DinoCool** est un jeu web inspiré du célèbre jeu du dinosaure de Google Chrome.
Le joueur contrôle un personnage capable de **sauter** et de **s'accroupir** pour éviter les obstacles tout en accumulant un score basé sur le temps de survie.
Le projet est entièrement développé en **HTML, CSS et JavaScript** et fonctionne directement dans le navigateur.

---

## 🛠 Technologies Utilisées

* **HTML5** — Structure de la page et des éléments du jeu
* **CSS3** — Styles, animations, mise en page, effets visuels
* **JavaScript** — Gestion du gameplay, physique, collisions, boucle de jeu
* **DOM Manipulation** — Création dynamique des entités
* **requestAnimationFrame** — Mise à jour fluide du jeu
* **Git / GitHub** — Contrôle de version et gestion du projet

---

## 🎮 Fonctionnalités Principales

* Gestion du **saut** et de la **gravité** du joueur
* Animation du joueur avec rotation pendant le jump
* Boucle de jeu limitée à **144 FPS** pour un rendu fluide
* Système de score dynamique basé sur le temps de survie
* Détection de collisions joueur / sol
* Génération dynamique des éléments (ex: sol et obstacles)
* Transition du menu vers le gameplay
* Adaptation automatique aux changements de taille de fenêtre ou zoom

---

## 🌐 Lien GitHub Pages

[https://chihebbhy.github.io/ChihebBenHadjYahia_DinoCool/](https://chihebbhy.github.io/ChihebBenHadjYahia_DinoCool/)

---

## 💡 Concepts et Nouveautés Explorées

### JavaScript & Game Dev

* Implémentation d’une **boucle de jeu** avec contrôle du framerate
* Utilisation de **requestAnimationFrame** pour un rendu optimisé
* Calculs physiques : gravité, vélocité, temps (dt)
* Gestion de collisions via positions absolues du DOM
* Système d’entités dynamiques via **classes JavaScript**

### CSS & Animations

* Animations CSS avec **transform** et **transition**
* Utilisation de **classes dynamiques** pour animer les sprites
* Mise en page responsive malgré l’utilisation d’éléments absolus

### Git & Gestion de Projet

* Utilisation de `git add`, `commit`, `push`
* Revenir à une version précédente
* Organisation d’un projet web complet sur **GitHub**

---

## ⚠️ Difficultés Rencontrées et Solutions

**Problème 1 : Hitbox du joueur incorrecte**

* Déplacement de la hitbox lors du zoom ou resize
* **Solution :** Recalcul automatique des positions avec `Player.reload()` et ajout d’un listener resize

**Problème 2 : FPS trop élevés**

* Le jeu tournait trop vite sur certains écrans 144Hz
* **Solution :** Limitation via un interval fixé à 144 FPS

**Problème 3 : Animation du sol incorrecte**

* Width ne se mettait pas à jour après la transition
* **Solution :** Utilisation d’une **classe CSS temporaire** pour étendre proprement le sol

**Problème 4 : Placement incorrect des entités**

* Certaines entités créées dans le mauvais conteneur
* **Solution :** Ajustement de la fonction `CreateEntity()` pour placer chaque élément correctement

---

## 🏁 Conclusion

**DinoCool** m’a permis de découvrir la logique d’un moteur de jeu minimaliste :

* Optimisation du framerate
* Gestion des collisions et physique
* Création d’un gameplay fluide et responsive

C’était un projet très complet et formateur, combinant **JavaScript, CSS et HTML** pour créer une expérience de jeu interactive directement dans le navigateur.
