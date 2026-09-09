"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";

export async function deleteMyAddress(
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

    const deletedAddress =
      await prisma.$transaction(async (tx) => {
        const address =
          await tx.customerAddress.findFirst({
            where: {
              id: addressId,
              customerId: customer.id,
            },
            select: {
              id: true,
              isDefault: true,
            },
          });

        if (!address) {
          return null;
        }

        await tx.customerAddress.delete({
          where: {
            id: address.id,
          },
        });

        // If the deleted address was the default,
        // make the oldest remaining address default.
        if (address.isDefault) {
          const nextAddress =
            await tx.customerAddress.findFirst({
              where: {
                customerId: customer.id,
              },
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
              },
            });

          if (nextAddress) {
            await tx.customerAddress.update({
              where: {
                id: nextAddress.id,
              },
              data: {
                isDefault: true,
              },
            });
          }
        }

        return address;
      });

    if (!deletedAddress) {
      return {
        success: false,
        error: "Address not found.",
      };
    }

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
      error: "Failed to delete address.",
    };
  }
}