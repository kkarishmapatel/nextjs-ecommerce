"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function setDefaultMyAddress(
  addressId: string
) {
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
      await prisma.customerAddress.findFirst({
        where: {
          id: addressId,
          customerId: customer.id,
        },
        select: {
          id: true,
        },
      });

    if (!address) {
      return {
        success: false,
        error: "Address not found.",
      };
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.customerAddress.updateMany({
          where: {
            customerId: customer.id,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });

        await tx.customerAddress.update({
          where: {
            id: address.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to set default address:",
      error
    );

    return {
      success: false,
      error:
        "Failed to set default address.",
    };
  }
}