-- ==============================================================================
-- PARTITIONNEMENT DE TABLES (Concept Avancé)
-- Objectif : Diviser la table des Commandes par année pour optimiser les 
-- requêtes sur les très grandes bases de données.
-- Note : Il s'agit d'un exemple d'architecture à mettre en place sur une 
-- nouvelle table, car PostgreSQL ne permet pas de partitionner une table existante 
-- de manière transparente sans migration complexe des données.
-- ==============================================================================

-- 1. Création de la table maître partitionnée
CREATE TABLE Commande_Archive (
    id UUID DEFAULT uuid_generate_v4(),
    numero_commande VARCHAR(100) NOT NULL,
    client_id UUID NOT NULL,
    montant_total DECIMAL(12, 2) NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, date_commande)
) PARTITION BY RANGE (date_commande);

-- 2. Création des partitions annuelles
CREATE TABLE Commande_Archive_2025 PARTITION OF Commande_Archive
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE Commande_Archive_2026 PARTITION OF Commande_Archive
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE Commande_Archive_2027 PARTITION OF Commande_Archive
    FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');

-- EXPLICATION : Les requêtes SELECT sur "Commande_Archive" utiliseront automatiquement
-- la bonne partition physique en fonction de la condition WHERE sur la date_commande.
-- Cela accélère drastiquement les requêtes sur de gros volumes.
