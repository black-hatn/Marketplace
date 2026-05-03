const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Création des fonctions SQL ---');
  
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION valider_commande(p_order_id TEXT) 
    RETURNS VOID AS $$
    DECLARE
        r RECORD;
    BEGIN
        -- 1. Vérification du paiement réussi
        IF NOT EXISTS (SELECT 1 FROM "Paiement" WHERE "commande_id" = p_order_id AND "statut" = 'REUSSI') THEN
            RAISE EXCEPTION 'Paiement non confirmé pour la commande %', p_order_id;
        END IF;

        -- 2. Boucle sur les lignes de commande pour vérifier le stock
        FOR r IN (SELECT "produit_id", "quantite", p."nom", p."stock" 
                  FROM "LigneCommande" lc 
                  JOIN "Produit" p ON lc."produit_id" = p."id" 
                  WHERE lc."commande_id" = p_order_id) 
        LOOP
            IF r.stock < r.quantite THEN
                RAISE EXCEPTION 'Stock insuffisant pour le produit %: Demandé %, Disponible %', r.nom, r.quantite, r.stock;
            END IF;

            -- 3. Décrémenter le stock
            UPDATE "Produit" SET "stock" = "stock" - r.quantite WHERE "id" = r."produit_id";
        END LOOP;

        -- 4. Passer la commande à VALIDEE
        UPDATE "Commande" SET "statut" = 'VALIDEE' WHERE "id" = p_order_id;
    END;
    $$ LANGUAGE plpgsql;
  `);

  console.log('--- Création des vues analytiques ---');

  await prisma.$executeRawUnsafe('DROP VIEW IF EXISTS vue_historique_client CASCADE;');
  await prisma.$executeRawUnsafe(`
    CREATE VIEW vue_historique_client AS
    SELECT 
        c.id AS commande_id, c."numero_commande", c."date_commande", c.statut, c."montant_total",
        cl.id AS client_id, cl.email,
        p.nom AS produit, lc.quantite, lc."prix_unitaire_ht"
    FROM "Commande" c
    JOIN "Client" cl ON c."client_id" = cl.id
    JOIN "LigneCommande" lc ON lc."commande_id" = c.id
    JOIN "Produit" p ON lc."produit_id" = p.id;
  `);

  await prisma.$executeRawUnsafe('DROP VIEW IF EXISTS vue_analyse_ventes CASCADE;');
  await prisma.$executeRawUnsafe(`
    CREATE VIEW vue_analyse_ventes AS
    SELECT 
        DATE_TRUNC('month', "date_commande") AS mois,
        COUNT(id) AS volume_ventes,
        SUM("montant_total") AS CA,
        AVG("montant_total") AS panier_moyen
    FROM "Commande" 
    WHERE statut != 'ANNULEE'
    GROUP BY 1;
  `);

  console.log('--- Insertion des données de test (Marques & Catégories) ---');

  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" (id, name, description, "createdAt", "updatedAt")
    VALUES 
    ('cat1', 'Tech', 'Produits technologiques', NOW(), NOW()),
    ('cat2', 'Luxe', 'Produits de luxe', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "Brand" (id, slug, name, title, tagline, description, story, "values", impact, image, email, password, "isVerified", "createdAt", "updatedAt")
    VALUES 
    ('b1', 'immersive', 'Immersive Pro', 'Immersive', 'Tech & Design', '...', '...', '...', '...', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', 'brand@example.com', 'hash', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('--- Insertion des produits ---');

  await prisma.$executeRawUnsafe(`
    INSERT INTO "Produit" (id, sku, nom, description, prix_ht, tva, prix_ttc, stock, images, categories, actif, date_creation, "updatedAt", "brandId", "categoryId")
    VALUES 
    ('p1', 'SKU-001', 'Smartphone Elite', 'Haut de gamme', 500000, 18, 590000, 50, ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'], ARRAY['Tech'], true, NOW(), NOW(), 'b1', 'cat1'),
    ('p2', 'SKU-002', 'Laptop Pro', 'Puissance brute', 800000, 18, 944000, 20, ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853'], ARRAY['Tech'], true, NOW(), NOW(), 'b1', 'cat1')
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('--- Données insérées avec succès ! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
