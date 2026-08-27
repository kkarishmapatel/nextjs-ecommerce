"use server";

import { prisma } from "@/lib/prisma";
import {
  customerAddressSchema,
} from "@/lib/customers/customerAddressSchema";

export async function createCustomerAddress(
  customerId: string,
  input: unknown
) {
  const parsed =
    customerAddressSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid address data.",
      fieldErrors: parsed.error.flatten()
        .fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          id: true,
        },
      });

    if (!customer) {
      return {
        success: false,
        error: "Customer not found.",
      };
    }

    const address =
      await prisma.$transaction(
        async (tx) => {
          if (data.isDefault) {
            await tx.customerAddress.updateMany(
              {
                where: {
                  customerId,
                  isDefault: true,
                },
                data: {
                  isDefault: false,
                },
              }
            );
          }

          return tx.customerAddress.create({
            data: {
              customerId,

              firstName: data.firstName,
              lastName: data.lastName,

              company:
                data.company || null,

              address1: data.address1,
              address2:
                data.address2 || null,

              city: data.city,
              state: data.state,
              postalCode:
                data.postalCode,

              country: data.country,

              phone: data.phone || null,

              isDefault:
                data.isDefault,
            },
          });
        }
      );

    return {
      success: true,
      address,
    };
  } catch (error) {
    console.error(
      "Failed to create customer address:",
      error
    );

    return {
      success: false,
      error:
        "Failed to create customer address.",
    };
  }
}