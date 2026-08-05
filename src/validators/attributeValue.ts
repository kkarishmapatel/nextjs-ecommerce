import { z } from "zod";

export const createAttributeValueSchema =
  z.object({
    value: z
      .string()
      .trim()
      .min(
        1,
        "Value is required."
      )
      .max(
        100,
        "Value is too long."
      ),
  });


export type CreateAttributeValueInput =
  z.infer<
    typeof createAttributeValueSchema
  >;