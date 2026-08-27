import { z } from "zod";

export const customerAddressSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name is too long."),

  company: z
    .string()
    .trim()
    .max(150, "Company name is too long.")
    .optional()
    .or(z.literal("")),

  address1: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .max(255, "Address is too long."),

  address2: z
    .string()
    .trim()
    .max(255, "Address is too long.")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City is too long."),

  state: z
    .string()
    .trim()
    .min(1, "State is required.")
    .max(100, "State is too long."),

  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required.")
    .max(20, "Postal code is too long."),

  country: z
    .string()
    .trim()
    .length(2, "Country must be a 2-letter code.")
    .toUpperCase(),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),

  isDefault: z.boolean(),
});

export type CustomerAddressInput = z.infer<
  typeof customerAddressSchema
>;