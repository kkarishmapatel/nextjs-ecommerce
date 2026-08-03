import { z } from "zod";

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
});

export type CreateVariantInput =
  z.infer<typeof createVariantSchema>;