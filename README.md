# Projet Notes Personnelles

Application de gestion de notes - Projet CPI2

## C'est quoi ?

Une app web pour gerer ses notes personnelles. On peut se connecter, creer des notes, les modifier ou les supprimer. Chaque note a un titre, un contenu et un niveau de priorite.

## Ce que ca fait

- Creer un compte et se connecter
- Ajouter des notes avec un titre, contenu et priorite
- Modifier ou supprimer ses notes
- Filtrer les notes par priorite (Basse, Moyenne, Haute)
- Rechercher une note par son titre ou contenu
- Trier les notes par date, titre ou priorite
- Interface responsive (marche sur telephone et pc)

## Technologies utilisees

- Backend : Laravel 12, Sanctum pour l'auth, SQLite
- Frontend : React 18, Tailwind CSS, Axios

## Comment lancer le projet

### Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve

Le backend tourne sur http://127.0.0.1:8000

### Frontend

cd frontend
npm install
npx vite --host

Le frontend tourne sur http://localhost:5173

## Compte de test

- Email : test@example.com
- Mot de passe : password123

Le seeder cree automatiquement un utilisateur test avec 3 notes d'exemple.
