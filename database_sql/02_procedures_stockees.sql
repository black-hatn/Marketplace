-- Procédure de validation de commande
CREATE OR REPLACE PROCEDURE valider_commande(p_commande_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    v_statut StatutCommande;
    ligne RECORD;
BEGIN
    SELECT statut INTO v_statut FROM Commande WHERE id = p_commande_id;
    
    IF v_statut IS NULL THEN
        RAISE EXCEPTION 'Commande introuvable';
    END IF;

    IF v_statut != 'PAYEE' THEN
        RAISE EXCEPTION 'La commande doit être PAYEE pour être validée';
    END IF;

    FOR ligne IN SELECT produit_id, quantite FROM LigneCommande WHERE commande_id = p_commande_id
    LOOP
        UPDATE Produit 
        SET stock = stock - ligne.quantite 
        WHERE id = ligne.produit_id AND stock >= ligne.quantite;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Stock insuffisant pour la validation';
        END IF;
    END LOOP;

    UPDATE Commande SET statut = 'VALIDEE' WHERE id = p_commande_id;
    COMMIT;
END;
$$;
