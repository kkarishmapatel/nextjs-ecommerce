"use server";

import { prisma } from "@/lib/prisma";
import {
  customerAddressSchema,
} from "@/lib/customers/customerAddressSchema";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function updateMyAddress(
  addressId: string,
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

    const existingAddress =
      await prisma.customerAddress.findFirst({
        where: {
          id: addressId,
          customerId: customer.id,
        },
        select: {
          id: true,
        },
      });

    if (!existingAddress) {
      return {
        success: false,
        error: "Address not found.",
      };
    }

    const address =
      await prisma.$transaction(
        async (tx) => {
          if (data.isDefault) {
            await tx.customerAddress.updateMany({
              where: {
                customerId: customer.id,
                isDefault: true,
                NOT: {
                  id: addressId,
                },
              },
              data: {
                isDefault: false,
              },
            });
          }

          return tx.customerAddress.update({
            where: {
              id: addressId,
            },
            data: {
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

              isDefault: data.isDefault,
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
      "Failed to update customer address:",
      error
    );

    return {
      success: false,
      error:
        "Failed to update customer address.",
    };
  }
}