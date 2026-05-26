-- ==============================================================================
-- SCHEMA COMPLET DE L'APPLICATION (Généré depuis Prisma)
-- A exécuter dans le SQL Editor de Supabase
-- ==============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Types énumérés
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "StatutPanier" AS ENUM ('ACTIF', 'ABANDONNE', 'CONVERTI');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'REUSSI', 'ECHOUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "MethodePaiement" AS ENUM ('STRIPE', 'PAYPAL', 'AIRTEL', 'MOOV');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Table Brand
CREATE TABLE IF NOT EXISTS "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "airtelMoney" TEXT,
    "moovMoney" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "banner" TEXT,
    "themeColor" TEXT NOT NULL DEFAULT '#06B6D4',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_slug_key" ON "Brand"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_email_key" ON "Brand"("email");

-- Table Category
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");

-- Table Client
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe_hash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "image" TEXT,
    "anonymise" BOOLEAN NOT NULL DEFAULT false,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Client_email_key" ON "Client"("email");
CREATE INDEX IF NOT EXISTS "Client_email_idx" ON "Client"("email");

-- Table Adresse
CREATE TABLE IF NOT EXISTS "Adresse" (
    "id" TEXT NOT NULL,
    "rue" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "code_postal" TEXT NOT NULL,
    "pays" TEXT NOT NULL DEFAULT 'Tchad',
    "client_id" TEXT NOT NULL,
    CONSTRAINT "Adresse_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Adresse_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table Produit
CREATE TABLE IF NOT EXISTS "Produit" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix_ht" DECIMAL(12,2) NOT NULL,
    "tva" DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    "prix_ttc" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "categories" TEXT[],
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "threeDStyle" TEXT DEFAULT 'cube',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" TEXT,
    "categoryId" TEXT,
    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Produit_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Produit_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Produit_sku_key" ON "Produit"("sku");
CREATE INDEX IF NOT EXISTS "Produit_sku_idx" ON "Produit"("sku");

-- Table Variante
CREATE TABLE IF NOT EXISTS "Variante" (
    "id" TEXT NOT NULL,
    "produit_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "prix_delta" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sku_suffix" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Variante_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Variante_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Variante_produit_id_idx" ON "Variante"("produit_id");

-- Table Wishlist
CREATE TABLE IF NOT EXISTS "Wishlist" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Wishlist_sessionId_productId_key" ON "Wishlist"("sessionId", "productId");

-- Table Panier
CREATE TABLE IF NOT EXISTS "Panier" (
    "id" TEXT NOT NULL,
    "client_id" TEXT,
    "session_id" TEXT NOT NULL,
    "statut" "StatutPanier" NOT NULL DEFAULT 'ACTIF',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modif" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Panier_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Panier_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Panier_session_id_key" ON "Panier"("session_id");

-- Table LignePanier
CREATE TABLE IF NOT EXISTS "LignePanier" (
    "id" TEXT NOT NULL,
    "panier_id" TEXT NOT NULL,
    "produit_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire_fige" DECIMAL(12,2) NOT NULL,
    CONSTRAINT "LignePanier_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LignePanier_panier_id_fkey" FOREIGN KEY ("panier_id") REFERENCES "Panier"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LignePanier_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table Commande
CREATE TABLE IF NOT EXISTS "Commande" (
    "id" TEXT NOT NULL,
    "numero_commande" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "adresse_livraison" TEXT NOT NULL,
    "adresse_facturation" TEXT NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "montant_total" DECIMAL(12,2) NOT NULL,
    "numero_suivi" TEXT,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Commande_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Commande_numero_commande_key" ON "Commande"("numero_commande");
CREATE INDEX IF NOT EXISTS "Commande_numero_commande_idx" ON "Commande"("numero_commande");
CREATE INDEX IF NOT EXISTS "Commande_statut_idx" ON "Commande"("statut");
CREATE INDEX IF NOT EXISTS "Commande_date_commande_idx" ON "Commande"("date_commande");

-- Table LigneCommande
CREATE TABLE IF NOT EXISTS "LigneCommande" (
    "id" TEXT NOT NULL,
    "commande_id" TEXT NOT NULL,
    "produit_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire_ht" DECIMAL(12,2) NOT NULL,
    "tva_appliquee" DECIMAL(5,2) NOT NULL,
    CONSTRAINT "LigneCommande_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LigneCommande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LigneCommande_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table Paiement
CREATE TABLE IF NOT EXISTS "Paiement" (
    "id" TEXT NOT NULL,
    "commande_id" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "methode" "MethodePaiement" NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "transaction_id_stripe" TEXT,
    "date_paiement" TIMESTAMP(3),
    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Paiement_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Paiement_transaction_id_stripe_key" ON "Paiement"("transaction_id_stripe");

-- Table Review
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "produit_id" TEXT NOT NULL,
    "clientId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "reply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Review_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Review_produit_id_clientId_key" ON "Review"("produit_id", "clientId");

-- Table Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "brandId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table Coupon
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Coupon_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");

-- Table Wallet
CREATE TABLE IF NOT EXISTS "Wallet" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "brandId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Wallet_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Wallet_brandId_key" ON "Wallet"("brandId");

-- Table WithdrawalRequest
CREATE TABLE IF NOT EXISTS "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "walletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WithdrawalRequest_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table interne Prisma (pour le suivi des migrations)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);
