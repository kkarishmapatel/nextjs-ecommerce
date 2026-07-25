import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(100, "Category name cannot exceed 100 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens."
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  sortOrder: z.coerce
    .number()
    .int()
    .min(0, "Sort order must be 0 or greater."),

  parentId: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type CreateCategoryInput = z.infer<
  typeof createCategorySchema
>;