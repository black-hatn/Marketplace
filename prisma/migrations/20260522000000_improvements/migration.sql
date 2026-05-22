-- #10: Coupon usage limits
ALTER TABLE "Coupon" ADD COLUMN "maxUses" INTEGER;
ALTER TABLE "Coupon" ADD COLUMN "usedCount" INTEGER NOT NULL DEFAULT 0;

-- #17: Mobile money payment methods
ALTER TYPE "MethodePaiement" ADD VALUE IF NOT EXISTS 'AIRTEL';
ALTER TYPE "MethodePaiement" ADD VALUE IF NOT EXISTS 'MOOV';

-- #18: Shipping tracking number
ALTER TABLE "Commande" ADD COLUMN "numero_suivi" TEXT;

-- #5: Review dedup - clientId + unique constraint
ALTER TABLE "Review" ADD COLUMN "clientId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Review_produit_id_clientId_key"
  ON "Review"("produit_id", "clientId")
  WHERE "clientId" IS NOT NULL;

-- P: Variantes produit
CREATE TABLE IF NOT EXISTS "Variante" (
    "id"         TEXT NOT NULL PRIMARY KEY,
    "produit_id" TEXT NOT NULL,
    "nom"        TEXT NOT NULL,
    "valeur"     TEXT NOT NULL,
    "stock"      INTEGER NOT NULL DEFAULT 0,
    "prix_delta" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sku_suffix" TEXT,
    "actif"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Variante_produit_id_fkey"
      FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Variante_produit_id_idx" ON "Variante"("produit_id");
