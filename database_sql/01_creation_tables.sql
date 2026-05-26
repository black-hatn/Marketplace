-- Extensions et Types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE RoleClient AS ENUM ('CLIENT', 'ADMIN');
CREATE TYPE StatutCommande AS ENUM ('EN_ATTENTE', 'PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE');
CREATE TYPE StatutPaiement AS ENUM ('EN_ATTENTE', 'REUSSI', 'ECHOUE');
CREATE TYPE MethodePaiement AS ENUM ('STRIPE', 'PAYPAL', 'AIRTEL_MONEY', 'MOOV_MONEY', 'CARTE_BANCAIRE');
CREATE TYPE StatutPanier AS ENUM ('ACTIF', 'ABANDONNE', 'CONVERTI');

-- Table Client
CREATE TABLE Client (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role RoleClient DEFAULT 'CLIENT',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Produit
CREATE TABLE Produit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    prix_ht DECIMAL(12, 2) NOT NULL,
    tva DECIMAL(5, 2) DEFAULT 18.00,
    stock INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Panier
CREATE TABLE Panier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES Client(id) ON DELETE SET NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    statut StatutPanier DEFAULT 'ACTIF',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table LignePanier
CREATE TABLE LignePanier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    panier_id UUID REFERENCES Panier(id) ON DELETE CASCADE,
    produit_id UUID REFERENCES Produit(id) ON DELETE CASCADE,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire_fige DECIMAL(12, 2) NOT NULL
);

-- Table Commande
CREATE TABLE Commande (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_commande VARCHAR(100) UNIQUE NOT NULL,
    client_id UUID REFERENCES Client(id) ON DELETE RESTRICT,
    adresse_livraison TEXT NOT NULL,
    statut StatutCommande DEFAULT 'EN_ATTENTE',
    montant_total DECIMAL(12, 2) NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table LigneCommande
CREATE TABLE LigneCommande (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commande_id UUID REFERENCES Commande(id) ON DELETE CASCADE,
    produit_id UUID REFERENCES Produit(id) ON DELETE RESTRICT,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire_ht DECIMAL(12, 2) NOT NULL,
    tva_appliquee DECIMAL(5, 2) NOT NULL
);

-- Table Paiement
CREATE TABLE Paiement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commande_id UUID REFERENCES Commande(id) ON DELETE RESTRICT,
    montant DECIMAL(12, 2) NOT NULL,
    methode MethodePaiement NOT NULL,
    statut StatutPaiement DEFAULT 'EN_ATTENTE',
    transaction_id VARCHAR(255) UNIQUE,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
