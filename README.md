# Marketplace Immersive - L'Horizon

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

## 🏗️ Structure du Projet

- `/app` : Pages et configuration de routage Next.js (App Router).
- `/components` : Composants réutilisables (UI, 3D, formulaires, etc.).
- `/lib` : Fonctions utilitaires, store Zustand.
- `/public` : Ressources statiques (images, polices).
- `/prisma` : Schémas et migrations de la base de données.
- `tailwind.config.ts` : Configuration des styles, couleurs (Tailwind CSS).

## 🌐 Déploiement Vercel

Ce projet est configuré pour être déployé très facilement sur [Vercel](https://vercel.com/), la plateforme native pour Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FL2-info2-enastic%2Fbd-avancee-black-hatn)

1. Connectez-vous à votre compte Vercel.
2. Importez le dépôt GitHub `L2-info2-enastic/bd-avancee-black-hatn`.
3. Configurez les variables d'environnement nécessaires.
4. Cliquez sur **Deploy**.

---

## 👨‍💻 Auteur

- **Nouradine Zakaria Mahamat** ([@black-hatn](https://github.com/black-hatn))
- **Email** : nouradinezakariamahamat2@gmail.com
- **Projet** : ENASTIC (Licence 2 Informatique) - Base de Données Avancées
