import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters.")
    .max(150, "Product name cannot exceed 150 characters."),

  slug: z
    .string()
    .trim()
    .min(3, "Slug is required.")
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens."
    ),

  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  brandId: z
    .string()
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "DRAFT",
    "ACTIVE",
    "OUT_OF_STOCK",
    "ARCHIVED",
  ]),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;