# SOKO - Stock Management App | Backend

API REST de gestion de stock et de ventes développée avec Node.js, Express et MongoDB.

SOKO Backend permet aux commerces et boutiques de gérer efficacement leurs produits, leurs stocks, leurs ventes et leurs pertes tout en assurant une authentification sécurisée grâce à Better Auth.

## Fonctionnalités

### Authentification et sécurité

* Inscription utilisateur
* Connexion sécurisée
* Gestion des sessions avec Better Auth
* Authentification basée sur les cookies HTTP Only
* Vérification d'adresse email
* Réinitialisation de mot de passe
* Déconnexion sécurisée
* Gestion des rôles et permissions
* Protection des routes privées
* Protection contre les abus grâce à Arcjet
* Sécurisation des en-têtes HTTP avec Helmet

### Gestion des boutiques

* Création de boutiques
* Consultation des boutiques
* Mise à jour des informations
* Suppression logique
* Restauration des boutiques supprimées

### Gestion des produits

* Création de produits
* Consultation des produits
* Recherche de produits
* Modification des informations
* Suppression logique

### Gestion des stocks

* Création de stock
* Consultation des stocks
* Ajout de quantité
* Retrait de quantité
* Suivi des mouvements de stock
* Suppression logique
* Restauration des stocks supprimés

### Gestion des ventes

* Enregistrement des ventes
* Consultation de l'historique
* Calcul automatique des montants
* Gestion des quantités vendues
* Suppression logique

### Gestion des pertes

* Déclaration des pertes
* Consultation de l'historique
* Justification des pertes
* Mise à jour automatique du stock
* Suppression logique

### Documentation

* Documentation Swagger/OpenAPI intégrée
* Test des endpoints directement depuis l'interface Swagger

---

## Architecture

Le projet suit une architecture inspirée du modèle MVC avec une séparation claire des responsabilités.

```text
SOKO-Backend
│
├── config/
│   ├── arcjet.js
│   ├── db.js
│   └── email.js
│
├── controllers/
│
├── services/
│
├── middlewares/
│
├── models/
│
├── routes/
│
├── errors/
│
├── auth.js
├── app.js
├── swagger-output.json
└── package.json
```

### Description des dossiers

| Dossier     | Description                                             |
| ----------- | ------------------------------------------------------- |
| config      | Configuration de la base de données, emails et sécurité |
| controllers | Gestion des requêtes HTTP                               |
| services    | Logique métier                                          |
| middlewares | Middlewares d'authentification et de validation         |
| models      | Schémas MongoDB                                         |
| routes      | Définition des routes API                               |
| errors      | Gestion centralisée des erreurs                         |

---

## Technologies utilisées

| Catégorie        | Technologie    |
| ---------------- | -------------- |
| Runtime          | Node.js        |
| Framework        | Express.js     |
| Base de données  | MongoDB        |
| ODM              | Mongoose       |
| Authentification | Better Auth    |
| Emails           | Resend         |
| Documentation    | Swagger UI     |
| Sécurité         | Arcjet, Helmet |
| Validation       | Validator.js   |

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/vanouofc/SOKO-Backend.git
cd SOKO-Backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet.

```env
PORT=3000

DB_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

RESEND_API_KEY=
FROM=

ARCJET_KEY=
ARCJET_ENV=development
```

---

## Lancement du projet

### Mode développement

```bash
npm start
```

Le serveur sera disponible sur :

```text
http://localhost:3000
```

---

## Authentification

Le projet utilise Better Auth pour gérer les utilisateurs et les sessions.

### Fonctionnement

1. L'utilisateur crée un compte.
2. Un email de vérification est envoyé.
3. Après validation de son adresse email, il peut se connecter.
4. Better Auth crée une session sécurisée.
5. Les routes protégées vérifient automatiquement la session.
6. La déconnexion invalide la session côté serveur.

### Routes d'authentification

```http
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
POST /api/auth/sign-out

GET  /api/auth/get-session

POST /api/auth/forget-password
POST /api/auth/reset-password

POST /api/auth/send-verification-email
POST /api/auth/verify-email
```

### Exemple côté Frontend

```javascript
const response = await fetch("http://localhost:3000/api/auth/get-session", {
    credentials: "include"
});

const session = await response.json();
```

> Les cookies de session doivent être envoyés avec `credentials: "include"`.

---

## Documentation Swagger

Après le démarrage du serveur, la documentation est accessible à l'adresse :

```text
http://localhost:3000/api-docs
```

Swagger permet :

* Visualiser les endpoints
* Tester les requêtes
* Consulter les schémas de données
* Vérifier les réponses attendues

---

## Principales routes API

### Boutiques

```http
GET    /api/boutiques
GET    /api/boutiques/:id
POST   /api/boutiques
PATCH  /api/boutiques/:id
PATCH  /api/boutiques/:id/restore
DELETE /api/boutiques/:id
```

### Produits

```http
GET    /api/produits
GET    /api/produits/:id
POST   /api/produits
PATCH  /api/produits/:id
DELETE /api/produits/:id
```

### Stocks

```http
GET    /api/stocks
GET    /api/stocks/:id

POST   /api/stocks

PATCH  /api/stocks/:id
PATCH  /api/stocks/:id/add
PATCH  /api/stocks/:id/remove
PATCH  /api/stocks/:id/restore

DELETE /api/stocks/:id
```

### Ventes

```http
GET    /api/ventes
GET    /api/ventes/:id

POST   /api/ventes

PATCH  /api/ventes/:id

DELETE /api/ventes/:id
```

### Pertes

```http
GET    /api/pertes
GET    /api/pertes/:id

POST   /api/pertes

PATCH  /api/pertes/:id

DELETE /api/pertes/:id
```

---

## Gestion des erreurs

L'application utilise un système centralisé de gestion des erreurs métier.

Exemple de réponse :

```json
{
  "success": false,
  "message": "La quantité demandée est supérieure au stock disponible."
}
```

---

## Sécurité

Les mécanismes de sécurité implémentés incluent :

* Better Auth
* Sessions sécurisées
* Cookies HTTP Only
* Vérification d'adresse email
* Protection Arcjet
* Helmet
* Validation des données
* Gestion centralisée des erreurs

---

## Scripts disponibles

### Démarrer le serveur

```bash
npm start
```

### Générer la documentation Swagger

```bash
npm run swagger
```

---

## Roadmap

* Gestion des fournisseurs
* Gestion des clients
* Tableau de bord analytique
* Export PDF
* Export Excel
* Rapports financiers
* Notifications en temps réel
* Gestion multi-boutiques avancée

---

## Auteur

**TINGUEU NGUIFO Shivano**

GitHub : https://github.com/vanouofc

Portfolio : https://shivano.pages.dev

---

## Licence

Ce projet est distribué sous licence ISC.
