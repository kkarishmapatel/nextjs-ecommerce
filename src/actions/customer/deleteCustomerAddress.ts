"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCustomerAddress(
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

    await prisma.customerAddress.delete({
      where: {
        id: addressId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to delete customer address:",
      error
    );

    return {
      success: false,
      error: "Failed to delete customer address.",
    };
  }
}