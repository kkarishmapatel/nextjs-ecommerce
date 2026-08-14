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
    .min(0, "Price cannot be negative."),

  compareAtPrice: z.coerce
    .number()
    .min(0, "Compare-at price cannot be negative.")
    .optional()
    .nullable(),

  costPrice: z.coerce
    .number()
    .min(0, "Cost price cannot be negative.")
    .optional()
    .nullable(),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),

  trackInventory: z.boolean(),

  allowBackorders: z.boolean(),

  lowStockThreshold: z.coerce
    .number()
    .int("Low-stock threshold must be a whole number.")
    .min(
      0,
      "Low-stock threshold cannot be negative."
    ),

  isDefault: z.boolean(),

  isActive: z.boolean(),

  selectedAttributes: z
    .array(variantAttributeSchema)
    .default([]),
}).refine(
  (data) =>
    data.compareAtPrice == null ||
    data.compareAtPrice >= data.price,
  {
    path: ["compareAtPrice"],
    message:
      "Compare-at price must be greater than or equal to price.",
  }
).refine(
  (data) =>
    data.trackInventory ||
    !data.allowBackorders,
  {
    path: ["allowBackorders"],
    message:
      "Backorders can only be enabled when inventory tracking is enabled.",
  }
).refine(
  (data) => {
    const attributeIds =
      data.selectedAttributes?.map(
        (item) => item.attributeId
      ) ?? [];

    return (
      new Set(attributeIds).size ===
      attributeIds.length
    );
  },
  {
    path: ["selectedAttributes"],
    message:
      "A variant can only have one value per attribute.",
  }
).refine(
  (data) => {
    const valueIds =
      data.selectedAttributes?.map(
        (item) => item.attributeValueId
      ) ?? [];

    return (
      new Set(valueIds).size ===
      valueIds.length
    );
  },
  {
    path: ["selectedAttributes"],
    message:
      "Duplicate attribute values are not allowed.",
  }
);

export type CreateVariantFormInput =
  z.input<typeof createVariantSchema>;

export type CreateVariantInput =
  z.infer<typeof createVariantSchema>;




