# Netflux — Catalogue Films & Séries

Application inspirée de Netflix, construite avec :

Backend : Symfony 7 + API Platform + Doctrine + JWT Auth

Frontend : Vue 3 (Composition API)

Fonctionnalités

✔ Authentification utilisateur (JWT)
✔ Affichage films/séries avec filtres (format/recherche)
✔ Gestion des favoris ⭐
✔ Panel admin (CRUD contenus + rôles utilisateurs)

Installation

Backend :

cd backend
composer install
symfony server:start


Frontend :

cd front
npm install
npm run dev

📌 API utiles

GET /api/contenus → Liste films & séries

GET /api/me → Profil utilisateur (via token)

Auteur: Damien Lefray
