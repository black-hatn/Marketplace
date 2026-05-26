-- ==============================================================================
-- AUDIT ET DÉCLENCHEURS (TRIGGERS)
-- Objectif : Garder un historique précis de toutes les modifications de prix
-- ==============================================================================

-- 1. Création de la table d'audit
CREATE TABLE IF NOT EXISTS HistoriquePrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produit_id UUID REFERENCES Produit(id) ON DELETE CASCADE,
    ancien_prix DECIMAL(12, 2),
    nouveau_prix DECIMAL(12, 2),
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_modificateur VARCHAR(100) DEFAULT CURRENT_USER
);

-- 2. Fonction exécutée par le Trigger
CREATE OR REPLACE FUNCTION audit_modification_prix()
RETURNS trigger AS $$
BEGIN
    -- On n'enregistre que si le prix a réellement changé
    IF OLD.prix_ht IS DISTINCT FROM NEW.prix_ht THEN
        INSERT INTO HistoriquePrix(produit_id, ancien_prix, nouveau_prix)
        VALUES (NEW.id, OLD.prix_ht, NEW.prix_ht);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Mise en place du Trigger sur la table Produit
DROP TRIGGER IF EXISTS trigger_audit_prix ON Produit;
CREATE TRIGGER trigger_audit_prix
    AFTER UPDATE ON Produit
    FOR EACH ROW
    EXECUTE FUNCTION audit_modification_prix();
