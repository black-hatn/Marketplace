-- ==============================================================================
-- RECHERCHE FULL-TEXT (FTS) NATIVE AVEC POSTGRESQL
-- Objectif : Optimiser les recherches de produits par mots-clés
-- ==============================================================================

-- 1. Ajout d'une colonne vectorielle pour stocker l'index de recherche
ALTER TABLE Produit ADD COLUMN IF NOT EXISTS document_recherche tsvector;

-- 2. Fonction pour mettre à jour automatiquement ce vecteur
CREATE OR REPLACE FUNCTION generer_document_recherche_produit()
RETURNS trigger AS $$
BEGIN
    NEW.document_recherche := 
        setweight(to_tsvector('french', COALESCE(NEW.nom, '')), 'A') ||
        setweight(to_tsvector('french', COALESCE(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger pour exécuter la fonction à chaque INSERT ou UPDATE
DROP TRIGGER IF EXISTS trigger_maj_recherche_produit ON Produit;
CREATE TRIGGER trigger_maj_recherche_produit
    BEFORE INSERT OR UPDATE ON Produit
    FOR EACH ROW
    EXECUTE FUNCTION generer_document_recherche_produit();

-- 4. Création d'un index GIN pour des performances maximales
CREATE INDEX IF NOT EXISTS idx_fts_produit ON Produit USING GIN (document_recherche);
