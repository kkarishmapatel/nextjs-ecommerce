"use server";

import { prisma } from "@/lib/prisma";

export async function setDefaultCustomerAddress(
  customerId: string,
  addressId: string
) {
  try {
    const address =
      await prisma.customerAddress.findFirst({
        where: {
          id: addressId,
          customerId,
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

    await prisma.$transaction(async (tx) => {
      // Remove the default flag from all
      // other addresses belonging to this customer.
      await tx.customerAddress.updateMany({
        where: {
          customerId,
          isDefault: true,
          NOT: {
            id: addressId,
          },
        },
        data: {
          isDefault: false,
        },
      });

      // Make the selected address default.
      await tx.customerAddress.update({
        where: {
          id: addressId,
        },
        data: {
          isDefault: true,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to set default customer address:",
      error
    );

    return {
      success: false,
      error: "Failed to set default address.",
    };
  }
}