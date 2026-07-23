import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters.")
    .max(100, "Brand name cannot exceed 100 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120, "Slug cannot exceed 120 characters.")
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

  sortOrder: z
    .number()
    .int()
    .min(0, "Sort order must be 0 or greater."),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;