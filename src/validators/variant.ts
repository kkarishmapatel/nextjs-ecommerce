import { z } from "zod";

const variantAttributeSchema = z.object({
  attributeId: z.string(),

  attributeValueId: z.string(),
});

export const createVariantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required.")
    .max(100),

  barcode: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  price: z.coerce
    .number()
    .min(0, "Price must be at least 0."),

  compareAtPrice: z.coerce
    .number()
    .nullable()
    .optional(),

  costPrice: z.coerce
    .number()
    .nullable()
    .optional(),

  stock: z.coerce
    .number()
    .int()
    .min(0),

  trackInventory: z.boolean(),

  allowBackorders: z.boolean(),

  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0),

  isDefault: z.boolean(),

  isActive: z.boolean(),
 
  selectedAttributes: z
  .array(variantAttributeSchema)
  .default([]),
});

export type CreateVariantFormInput =
    z.input<typeof createVariantSchema>;

export type CreateVariantInput =
  z.infer<typeof createVariantSchema>;

  
  

