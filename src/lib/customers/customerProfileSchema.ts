import { z } from "zod";

export const updateCustomerProfileSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters."
      )
      .max(
        100,
        "Name must not exceed 100 characters."
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(
        "Please enter a valid email address."
      ),

    password: z
      .string()
      .max(
        100,
        "Password must not exceed 100 characters."
      )
      .optional()
      .or(z.literal("")),
  });

export type UpdateCustomerProfileInput =
  z.infer<
    typeof updateCustomerProfileSchema
  >;