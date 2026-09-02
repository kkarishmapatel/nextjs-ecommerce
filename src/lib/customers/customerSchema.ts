import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must not exceed 100 characters."),

  role: z.enum([
    "CUSTOMER",
    "ADMIN",
  ]),
});

export type CreateCustomerInput =
  z.infer<typeof createCustomerSchema>;

  export const updateCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .max(100, "Password must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  role: z.enum([
    "CUSTOMER",
    "ADMIN",
  ]),
});

export type UpdateCustomerInput =
  z.infer<typeof updateCustomerSchema>;