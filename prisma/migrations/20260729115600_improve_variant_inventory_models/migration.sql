/*
  Warnings:

  - Added the required column `newStock` to the `InventoryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousStock` to the `InventoryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "InventoryHistory" ADD COLUMN     "newStock" INTEGER NOT NULL,
ADD COLUMN     "previousStock" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "allowBackorders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "costPrice" DECIMAL(65,30),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");
