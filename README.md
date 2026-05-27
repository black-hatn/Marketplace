<div align="center">

# 🛒 Immersive Marketplace — L'Horizon

**Plateforme e-commerce multi-secteurs premium — Tchad & Afrique**

[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github-actions)](https://github.com/L2-info2-enastic/bd-avancee-black-hatn)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Déployé-black?style=flat-square&logo=vercel)](https://marketplacetd.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

🌍 **[marketplacetd.vercel.app](https://marketplacetd.vercel.app/)** — Accès live

</div>

---

## 📋 Table des Matières

- [Présentation](#-présentation)
- [Démo Live](#-démo-live)
- [Architecture Base de Données](#️-architecture-base-de-données-avancée)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#️-stack-technique)
- [Démarrage Rapide](#-démarrage-rapide)
- [Structure du Projet](#-structure-du-projet)
- [Sécurité](#-sécurité)
- [Auteur](#-auteur)

---

## 🎯 Présentation

**Immersive Marketplace** est une plateforme e-commerce complète développée dans le cadre du cours **Base de Données Avancées**. Elle intègre une application Next.js 14 production-ready connectée à une base **PostgreSQL avancée** (Supabase) exploitant : procédures stockées, vues matérialisées, index GIN Full-Text, triggers d'audit et partitionnement de tables.

---

## 🚀 Démo Live

| Rôle | URL | Identifiants |
|------|-----|-------------|
| **Site public** | [marketplacetd.vercel.app](https://marketplacetd.vercel.app/fr) | — |
| **Admin** | [/fr/admin](https://marketplacetd.vercel.app/fr/admin) | Email : voir `.env.example` |
| **Espace Vendeur** | [/fr/vendeur/dashboard](https://marketplacetd.vercel.app/fr/vendeur/dashboard) | Compte vendeur démo |
| **Code promo démo** | Panier → "DEMO20" | −20% sur tout |

---

## 🗄️ Architecture Base de Données Avancée

> Documentation complète : [`docs/sql-advanced.md`](docs/sql-advanced.md)

Le projet démontre une maîtrise de **6 concepts avancés PostgreSQL** :

| Concept | Fichier SQL | Description |
|---------|-------------|-------------|
| 📦 **Tables, Enums & UUID** | `01_creation_tables.sql` | Schéma complet avec types personnalisés |
| ⚙️ **Procédures Stockées** | `02_procedures_stockees.sql` | Validation commande atomique + mise à jour stock |
| 📊 **Vues Matérialisées** | `03_vues_analytiques.sql` | Analytics CA mensuel, recommandations produits |
| 🔍 **Full-Text Search GIN** | `04_recherche_full_text.sql` | Index GIN vectoriel, recherche multilingue |
| 🔔 **Triggers & Audit** | `05_triggers_audit.sql` | Historisation automatique des changements de prix |
| ⚡ **Partitionnement** | `06_partitionnement_commandes.sql` | Range partitioning par date sur les commandes |

### Schéma Prisma (15 modèles)

```
Brand ─────────── Produit ──── Variante
  │                  │
  ├── Coupon         ├── LigneCommande ── Commande ── Paiement
  ├── Wallet         ├── Review                 └── Client
  └── Notification   ├── Wishlist               └── Adresse
                     └── Category
```

### Index performants déclarés

```prisma
@@index([email])            // Client — auth O(log n)
@@index([sku])              // Produit — lookup référence
@@index([numero_commande])  // Commande — tracking client
@@index([statut])           // Commande — filtres admin
@@index([date_commande])    // Commande — requêtes analytiques
@@index([produit_id])       // Variante — JOINs optimisés
```

---

## ✨ Fonctionnalités

### Pour les Clients
- 🛍️ Catalogue avec filtres avancés (prix, note, stock, catégorie)
- 🔍 Recherche globale temps réel (produits + marques)
- 🛒 Panier persistant (Zustand + localStorage)
- 💳 Checkout Stripe (carte) + Mobile Money (WhatsApp)
- ❤️ Wishlist sans inscription (session cookie)
- ⭐ Système d'avis avec anti-spam (rate limiting par IP)
- 🔄 Comparateur de produits (jusqu'à 4)
- 📦 Suivi de commandes en temps réel
- 🌐 Interface trilingue (FR / EN / AR avec support RTL)

### Pour les Vendeurs
- 📊 Dashboard analytics (CA, commandes, graphique 30j)
- 📦 Gestion produits (CRUD avec upload Cloudinary)
- 🏷️ Système de coupons (% ou fixe, limite d'usage, expiration)
- 💰 Portefeuille & demandes de retrait (Airtel/Moov Money)
- 🔔 Notifications temps réel
- 💬 Réponses aux avis clients
- 👤 Profil boutique personnalisable (bannière, couleur thème)

### Pour l'Administrateur
- 👥 Gestion clients et vendeurs
- ✅ Certification des vendeurs
- 📋 Suivi et gestion de toutes les commandes
- 📈 Analytics globales avec vue `vue_analyse_ventes`
- 🔔 Centre de notifications centralisé
- 🔍 Page d'audit du code (qualité)

---

## 🛠️ Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Auth** | NextAuth.js (JWT, bcrypt, RBAC 3 rôles) |
| **Base de Données** | PostgreSQL 15 (Supabase), Prisma ORM 6 |
| **Paiements** | Stripe (carte), Mobile Money via WhatsApp |
| **Stockage** | Cloudinary (images produits, profils) |
| **Emails** | Resend (confirmation commande, expédition, annulation) |
| **i18n** | next-intl (FR / EN / AR + RTL) |
| **État global** | Zustand + persist middleware |
| **3D** | Three.js + React Three Fiber (lazy-loaded) |
| **PWA** | next-pwa (service worker, manifest) |
| **Déploiement** | Vercel (Edge Network) |

---

## 🏁 Démarrage Rapide

### Prérequis
- Node.js ≥ 18
- npm ≥ 9
- Un projet Supabase (PostgreSQL)
- Comptes Stripe, Cloudinary, Resend (optionnels pour le dev)

### Installation

```bash
# 1. Cloner le dépôt académique
git clone https://github.com/L2-info2-enastic/bd-avancee-black-hatn.git
cd "bd-avancee-black-hatn/Site E-Commerce"

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 4. Générer le client Prisma
npx prisma generate

# 5. Appliquer les migrations
npx prisma migrate deploy

# 6. (Optionnel) Charger les données de démo
npx prisma db seed

# 7. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Scripts SQL Avancés

```bash
# Appliquer les scripts SQL dans l'ordre
psql $DATABASE_URL < database_sql/01_creation_tables.sql
psql $DATABASE_URL < database_sql/02_procedures_stockees.sql
psql $DATABASE_URL < database_sql/03_vues_analytiques.sql
psql $DATABASE_URL < database_sql/04_recherche_full_text.sql
psql $DATABASE_URL < database_sql/05_triggers_audit.sql
psql $DATABASE_URL < database_sql/06_partitionnement_commandes.sql
```

---

## 📁 Structure du Projet

```
Site E-Commerce/
├── app/
│   └── [locale]/           # Routes internationalisées (fr/en/ar)
│       ├── admin/          # Dashboard administrateur
│       ├── vendeur/        # Espace vendeur
│       ├── produit/[id]/   # Fiche produit avec 3D
│       ├── checkout/       # Tunnel de paiement
│       └── ...
├── components/             # 48 composants réutilisables
├── database_sql/           # Scripts SQL avancés (BD Avancées)
│   ├── 01_creation_tables.sql
│   ├── 02_procedures_stockees.sql
│   ├── 03_vues_analytiques.sql
│   ├── 04_recherche_full_text.sql
│   ├── 05_triggers_audit.sql
│   └── 06_partitionnement_commandes.sql
├── docs/
│   └── sql-advanced.md     # Documentation BD avancée
├── lib/
│   ├── actions.ts          # Server Actions centralisées
│   ├── auth.ts             # Configuration NextAuth
│   ├── db.ts               # Singleton Prisma
│   └── rateLimit.ts        # Rate limiting in-memory
├── messages/               # Traductions (fr/en/ar)
├── prisma/
│   ├── schema.prisma       # Schéma 15 modèles
│   └── seed.ts             # Données de démo
├── .env.example            # Template variables d'environnement
├── SECURITY.md             # Politique de sécurité
└── README.md               # Ce fichier
```

---

## 🔒 Sécurité

Voir [`SECURITY.md`](SECURITY.md) pour la liste complète des mesures implémentées.

Points clés :
- Authentification JWT avec guards RBAC sur toutes les routes protégées
- Mots de passe hashés bcrypt (coût 10)
- Rate limiting sur connexion et soumission d'avis
- Transactions Prisma pour éliminer les race conditions
- Aucun secret exposé côté client

---

## 🌐 Internationalisation

| Langue | Code | Direction |
|--------|------|-----------|
| 🇫🇷 Français | `fr` | LTR |
| 🇬🇧 Anglais | `en` | LTR |
| 🇸🇦 Arabe | `ar` | **RTL** |

---

## 👨‍💻 Auteur

**Nouradine Zakaria Mahamat**  
[@black-hatn](https://github.com/black-hatn) • [nouradinezakariamahamat2@gmail.com](mailto:nouradinezakariamahamat2@gmail.com)

> **Projet** : Base de Données Avancées — Site E-Commerce Multi-Secteurs  
> **Institution** : L2 Info2 — ENASTIC  
> **Année** : 2025–2026
