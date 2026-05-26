-- Vue : Historique des achats par client
CREATE OR REPLACE VIEW vue_historique_achats AS
SELECT 
    c.id AS client_id,
    c.nom,
    c.prenom,
    c.email,
    cmd.numero_commande,
    cmd.date_commande,
    cmd.montant_total,
    cmd.statut AS statut_commande,
    p.sku,
    p.nom AS nom_produit,
    lc.quantite,
    lc.prix_unitaire_ht
FROM Client c
JOIN Commande cmd ON c.id = cmd.client_id
JOIN LigneCommande lc ON cmd.id = lc.commande_id
JOIN Produit p ON lc.produit_id = p.id
ORDER BY cmd.date_commande DESC;

-- Vue Matérialisée : Analyse des ventes mensuelles
CREATE MATERIALIZED VIEW vue_analyse_ventes AS
SELECT 
    DATE_TRUNC('month', cmd.date_commande) AS mois,
    p.id AS produit_id,
    p.nom AS nom_produit,
    SUM(lc.quantite) AS total_unites_vendues,
    SUM(lc.quantite * lc.prix_unitaire_ht) AS chiffre_affaires_ht
FROM Commande cmd
JOIN LigneCommande lc ON cmd.id = lc.commande_id
JOIN Produit p ON lc.produit_id = p.id
WHERE cmd.statut IN ('VALIDEE', 'EXPEDIEE', 'LIVREE')
GROUP BY mois, p.id, p.nom
ORDER BY mois DESC, chiffre_affaires_ht DESC;

-- Vue : Recommandations basées sur les achats croisés
CREATE OR REPLACE VIEW vue_recommandations_produits AS
WITH AchatsCroises AS (
    SELECT 
        lc1.produit_id AS produit_cible,
        lc2.produit_id AS produit_recommande,
        COUNT(DISTINCT cmd.client_id) AS force_recommandation
    FROM LigneCommande lc1
    JOIN Commande cmd ON lc1.commande_id = cmd.id
    JOIN LigneCommande lc2 ON cmd.id = lc2.commande_id
    WHERE lc1.produit_id != lc2.produit_id
      AND cmd.statut IN ('VALIDEE', 'EXPEDIEE', 'LIVREE')
    GROUP BY lc1.produit_id, lc2.produit_id
)
SELECT 
    ac.produit_cible,
    p1.nom AS nom_produit_cible,
    ac.produit_recommande,
    p2.nom AS nom_produit_recommande,
    ac.force_recommandation
FROM AchatsCroises ac
JOIN Produit p1 ON ac.produit_cible = p1.id
JOIN Produit p2 ON ac.produit_recommande = p2.id
WHERE ac.force_recommandation >= 1
ORDER BY ac.produit_cible, ac.force_recommandation DESC;
