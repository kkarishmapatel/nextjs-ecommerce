import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name is required.")
    .max(100, "Attribute name is too long."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(100, "Slug is too long."),

  isActive: z.boolean(),
});

export type CreateAttributeInput =
  z.infer<typeof createAttributeSchema>;