"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import {
  customerAddressSchema,
} from "@/lib/customers/customerAddressSchema";

export async function createMyAddress(
  input: unknown
) {
  const parsed =
    customerAddressSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid address data.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const customer =
      await getCurrentCustomer();

    if (!customer) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    const address =
      await prisma.$transaction(
        async (tx) => {
          // If this is the first address,
          // make it the default automatically.
          const addressCount =
            await tx.customerAddress.count({
              where: {
                customerId: customer.id,
              },
            });

          const isDefault =
            addressCount === 0
              ? true
              : data.isDefault;

          // Only one address can be default.
          if (isDefault) {
            await tx.customerAddress.updateMany({
              where: {
                customerId: customer.id,
                isDefault: true,
              },
              data: {
                isDefault: false,
              },
            });
          }

          return tx.customerAddress.create({
            data: {
              customerId: customer.id,

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

              phone:
                data.phone || null,

              isDefault,
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