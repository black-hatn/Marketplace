# Marketplace Immersive - L'Horizon

[![Déployé sur Vercel](https://img.shields.io/badge/Vercel-Déployé-black?style=for-the-badge&logo=vercel)](https://marketplacetd.vercel.app/)

🌍 **Lien du projet en direct** : [https://marketplacetd.vercel.app/](https://marketplacetd.vercel.app/)

Plateforme e-commerce multi-secteurs de pointe, conçue avec **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Zustand**, et une **architecture headless**. Elle propose une expérience utilisateur ultra-moderne avec des animations fluides, un design glassmorphism, et un support 3D interactif.

---

## ✨ Fonctionnalités Principales

- **Expérience Immersive** : Navigation optimisée avec `app/page.tsx`, incluant un design glassmorphism et support natif dark/light mode.
- **Composants Modulaires** : Répertoire `components/` contenant un Mega Menu, une recherche prédictive, des grilles Bento, des filtres avancés, un tunnel de paiement complet, et des indicateurs de confiance.
- **Gestion du Panier (Zustand)** : `lib/store.ts` implémente un panier multi-vendeurs avec persistance des données locales (local storage).
- **Modélisation 3D** : Intégration optionnelle d'objets 3D dans l'interface (`components/ThreePlaceholder.tsx`) via Three.js.
- **Accessibilité (A11y)** : Respect strict des standards d'accessibilité (étiquettes, rôles ARIA, gestion du focus).

---

## 🛠️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir :
- **Node.js** (v18 ou supérieure recommandé)
- **npm** (ou yarn/pnpm)
- **Git**

---

## 🚀 Démarrage Rapide

1. **Cloner le projet** (si ce n'est pas déjà fait) :
   ```bash
   git clone https://github.com/L2-info2-enastic/bd-avancee-black-hatn.git
   cd "Site E-Commerce"
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur** :
   Rendez-vous sur `http://localhost:3000` pour visualiser l'application.

---

## 🏗️ Structure du Projet & Base de Données

Le projet se divise entre le code applicatif et les scripts de base de données avancés (PostgreSQL) exigés par le cours :

### 1. Code E-Commerce (Next.js)
- `/app` : Pages et configuration de routage Next.js (App Router).
- `/components` : Composants réutilisables (UI, 3D, formulaires, etc.).
- `/lib` : Fonctions utilitaires, store Zustand.
- `/prisma` : Schémas et migrations de la base de données.

### 2. Scripts de Base de Données Avancées (`/database_sql`)
Le dossier `database_sql` contient tout le code SQL natif démontrant des compétences avancées en PostgreSQL :
- **Tables, Enums & UUIDs** (`01_creation_tables.sql`)
- **Procédures Stockées Transactionnelles** (`02_procedures_stockees.sql`) : Gère la validation des commandes et la mise à jour des stocks.
- **Vues Matérialisées & Analytiques** (`03_vues_analytiques.sql`) : Historique des achats, analyse des ventes et recommandations de produits.
- **Recherche Full-Text GIN** (`04_recherche_full_text.sql`) : Indexation vectorielle pour des recherches rapides.
- **Triggers et Audit** (`05_triggers_audit.sql`) : Historisation automatique des changements de prix.
- **Partitionnement de Tables** (`06_partitionnement_commandes.sql`) : Stratégie de partitionnement par plage de dates.

---

## 👨‍💻 Auteur

- **Nouradine Zakaria Mahamat** ([@black-hatn](https://github.com/black-hatn))
- **Email** : nouradinezakariamahamat2@gmail.com
- **Projet** : Base de Données Avancées : Site E-commerce
