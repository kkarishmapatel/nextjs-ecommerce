-- CreateEnum
CREATE TYPE "InventoryReason" AS ENUM ('INITIAL_STOCK', 'RESTOCK', 'ORDER', 'RETURN', 'MANUAL_ADJUSTMENT');

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "compareAtPrice" DECIMAL(65,30),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "weight" DECIMAL(65,30),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantAttributeValue" (
    "variantId" TEXT NOT NULL,
    "attributeValueId" TEXT NOT NULL,

    CONSTRAINT "VariantAttributeValue_pkey" PRIMARY KEY ("variantId","attributeValueId")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryHistory" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "change" INTEGER NOT NULL,
    "reason" "InventoryReason" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_slug_key" ON "Attribute"("slug");

-- CreateIndex
CREATE INDEX "AttributeValue_attributeId_idx" ON "AttributeValue"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_value_key" ON "AttributeValue"("attributeId", "value");

-- CreateIndex
CREATE INDEX "VariantAttributeValue_attributeValueId_idx" ON "VariantAttributeValue"("attributeValueId");

-- CreateIndex
CREATE INDEX "ProductImage_variantId_idx" ON "ProductImage"("variantId");

-- CreateIndex
CREATE INDEX "InventoryHistory_variantId_idx" ON "InventoryHistory"("variantId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttributeValue" ADD CONSTRAINT "VariantAttributeValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttributeValue" ADD CONSTRAINT "VariantAttributeValue_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryHistory" ADD CONSTRAINT "InventoryHistory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
