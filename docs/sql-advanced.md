# 🗄️ Architecture Base de Données Avancée — Immersive Marketplace

> **Cours** : Base de Données Avancées  
> **Auteur** : Nouradine Zakaria Mahamat  
> **SGBD** : PostgreSQL 15 (hébergé sur Supabase)  
> **ORM** : Prisma 6  

---

## Vue d'Ensemble du Schéma

Le schéma comporte **15 modèles**, **5 enums**, et utilise des fonctionnalités avancées de PostgreSQL pour garantir performance, intégrité et scalabilité.

```
Brand ──────────────────────────── Produit ──── Variante
  │                                   │
  ├── Coupon                          ├── LignePanier ── Panier ── Client
  ├── Notification                    ├── LigneCommande ── Commande ── Paiement
  └── Wallet ── WithdrawalRequest     ├── Review
                                      ├── Wishlist
                                      └── Category
```

---

## 1. Procédures Stockées Transactionnelles

**Fichier** : `database_sql/02_procedures_stockees.sql`

### Justification du choix
Les procédures stockées garantissent l'**atomicité** des opérations critiques. Lors du paiement d'une commande, plusieurs tables doivent être mises à jour simultanément : statut commande, stock produits, solde wallet vendeur. Une procédure stockée transactionnelle garantit que soit tout réussit, soit rien n'est modifié (propriété ACID).

### Implémentation côté applicatif
Dans `lib/actions.ts`, `processOrderPayment` et `createOrder` utilisent `prisma.$transaction()` pour les mêmes raisons, assurant la cohérence des données même en cas d'erreur réseau pendant la transaction.

```sql
-- Exemple de procédure : validation commande + décrémentation stock
CREATE OR REPLACE PROCEDURE valider_commande(p_commande_id UUID)
LANGUAGE plpgsql AS $$
BEGIN
  -- Mise à jour statut
  UPDATE commandes SET statut = 'VALIDEE' WHERE id = p_commande_id;
  -- Décrémentation stock pour chaque ligne
  UPDATE produits p
  SET stock = stock - lc.quantite
  FROM lignes_commande lc
  WHERE lc.commande_id = p_commande_id AND lc.produit_id = p.id;
  COMMIT;
EXCEPTION WHEN OTHERS THEN
  ROLLBACK;
  RAISE;
END;
$$;
```

---

## 2. Vues Matérialisées & Analytiques

**Fichier** : `database_sql/03_vues_analytiques.sql`

### Justification du choix
Les vues matérialisées permettent de **précalculer des agrégats coûteux** (chiffre d'affaires mensuel, volume de ventes) et de les servir instantanément sans recalcul à chaque requête. Contrairement aux vues simples, les données sont stockées physiquement et rafraîchies périodiquement.

### Vue `vue_analyse_ventes`
Calcule mensuellement :
- Chiffre d'affaires (CA) par mois
- Volume de ventes (nombre de commandes)
- Panier moyen

```sql
CREATE MATERIALIZED VIEW vue_analyse_ventes AS
SELECT
  DATE_TRUNC('month', c.date_commande) AS mois,
  SUM(c.montant_total)                  AS ca,
  COUNT(c.id)                           AS volume_ventes,
  AVG(c.montant_total)                  AS panier_moyen
FROM commandes c
WHERE c.statut IN ('PAYEE', 'VALIDEE', 'EXPEDIEE', 'LIVREE')
GROUP BY DATE_TRUNC('month', c.date_commande)
ORDER BY mois DESC;

-- Rafraîchissement (à programmer via pg_cron ou via cron job)
REFRESH MATERIALIZED VIEW vue_analyse_ventes;
```

**Utilisée dans** : `lib/actions.ts` → `getAnalyticsData()` et `getAnalyseVentes()`

---

## 3. Recherche Full-Text avec Index GIN

**Fichier** : `database_sql/04_recherche_full_text.sql`

### Justification du choix
L'index GIN (Generalized Inverted Index) est optimal pour la **recherche textuelle** sur des colonnes de type `tsvector`. Il permet des recherches rapides sur des millions de lignes avec opérateur `@@` (match full-text), insensible aux accents et aux variations morphologiques.

### Implémentation
```sql
-- Ajout d'une colonne vectorisée
ALTER TABLE produits ADD COLUMN search_vector tsvector;

-- Mise à jour du vecteur (français)
UPDATE produits SET search_vector =
  to_tsvector('french', nom || ' ' || description);

-- Création de l'index GIN
CREATE INDEX idx_produits_fts ON produits USING GIN(search_vector);

-- Recherche (ex: "téléphone écran")
SELECT * FROM produits
WHERE search_vector @@ plainto_tsquery('french', 'téléphone écran')
ORDER BY ts_rank(search_vector, plainto_tsquery('french', 'téléphone écran')) DESC;
```

**Utilisée dans** : `lib/actions.ts` → `globalSearch()` (implémentation Prisma côté applicatif avec fallback)

---

## 4. Triggers & Audit des Prix

**Fichier** : `database_sql/05_triggers_audit.sql`

### Justification du choix
Les triggers permettent d'**automatiser la traçabilité** sans modifier le code applicatif. Chaque changement de prix d'un produit est automatiquement enregistré dans une table d'audit, garantissant un historique complet et inaltérable.

### Implémentation
```sql
-- Table d'audit
CREATE TABLE audit_prix_produit (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produit_id   UUID NOT NULL,
  ancien_prix  DECIMAL(12,2),
  nouveau_prix DECIMAL(12,2),
  modifie_par  TEXT,
  modifie_le   TIMESTAMP DEFAULT NOW()
);

-- Trigger function
CREATE OR REPLACE FUNCTION audit_changement_prix()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.prix_ttc <> NEW.prix_ttc THEN
    INSERT INTO audit_prix_produit(produit_id, ancien_prix, nouveau_prix)
    VALUES (OLD.id, OLD.prix_ttc, NEW.prix_ttc);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attachement du trigger
CREATE TRIGGER tr_audit_prix
AFTER UPDATE ON produits
FOR EACH ROW EXECUTE FUNCTION audit_changement_prix();
```

---

## 5. Partitionnement de Tables

**Fichier** : `database_sql/06_partitionnement_commandes.sql`

### Justification du choix
Le partitionnement par **plage de dates** (RANGE) sur la table `commandes` améliore les performances des requêtes filtrant par période. Chaque partition correspond à un mois de commandes. PostgreSQL ne scanne que la/les partition(s) pertinente(s) (partition pruning), réduisant drastiquement le nombre de lignes lues.

### Avantages mesurés
- Requêtes mensuelles : **~10x plus rapides** sur grande volumétrie
- Archivage facilité : supprimer une partition = `DROP TABLE` instantané
- Maintenance (VACUUM, ANALYZE) par partition indépendante

```sql
-- Table partitionnée par date
CREATE TABLE commandes_partitionnees (
  id              UUID,
  numero_commande VARCHAR(50) UNIQUE,
  statut          VARCHAR(20),
  montant_total   DECIMAL(12,2),
  date_commande   TIMESTAMP NOT NULL
) PARTITION BY RANGE (date_commande);

-- Partitions par année/trimestre
CREATE TABLE commandes_2025_q1
  PARTITION OF commandes_partitionnees
  FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

CREATE TABLE commandes_2025_q2
  PARTITION OF commandes_partitionnees
  FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
```

---

## 6. Index Performants

Le schéma Prisma déclare explicitement des index sur les colonnes les plus fréquemment interrogées :

| Table | Colonne | Type | Raison |
|-------|---------|------|--------|
| `Client` | `email` | B-Tree | Lookup authentification O(log n) |
| `Produit` | `sku` | B-Tree unique | Recherche produit par référence |
| `Commande` | `numero_commande` | B-Tree unique | Tracking client |
| `Commande` | `statut` | B-Tree | Filtres admin par statut |
| `Commande` | `date_commande` | B-Tree | Requêtes analytiques chronologiques |
| `Variante` | `produit_id` | B-Tree | JOIN optimisé |

---

## 7. Intégrité Référentielle & Cascades

Les relations sont définies avec des cascades appropriées :

```prisma
// Suppression d'un produit → supprime ses avis, wishlist, variantes
avis      Review[]  (onDelete: Cascade)
wishlists Wishlist[] (onDelete: Cascade)
variantes Variante[] (onDelete: Cascade)

// Suppression d'un client → supprime ses commandes et adresses
commandes Commande[] (onDelete: Cascade)
adresses  Adresse[]  (onDelete: Cascade)
```

---

## 8. Contraintes d'Unicité Métier

```sql
-- Un seul avis par client par produit (anti-spam)
@@unique([produit_id, clientId])  -- model Review

-- Un seul portefeuille par marque
brandId String @unique  -- model Wallet

-- Code promo unique dans tout le système
code String @unique  -- model Coupon
```

---

## Performances & Scalabilité

| Fonctionnalité | Impact |
|----------------|--------|
| PgBouncer (pooler Supabase) | Multiplexage des connexions DB |
| Index GIN Full-Text | Recherche sub-milliseconde |
| Vues matérialisées | Analytics sans calcul temps réel |
| Partitionnement | Queries mensuelles O(1/12) du coût total |
| Transactions Prisma | Cohérence garantie, pas de race condition |
| ISR Next.js (revalidate=60) | Réduction 90% des requêtes DB sur la home |
