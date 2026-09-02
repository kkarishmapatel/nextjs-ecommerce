"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCustomer(
  customerId: string
) {
  try {
    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          id: true,
          userId: true,
        },
      });

    if (!customer) {
      return {
        success: false,
        error: "Customer not found.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Deleting Customer will also delete
      // CustomerAddress records because of
      // onDelete: Cascade.
      await tx.customer.delete({
        where: {
          id: customer.id,
        },
      });

      // Delete the associated User as well.
      await tx.user.delete({
        where: {
          id: customer.userId,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to delete customer:",
      error
    );

    return {
      success: false,
      error: "Failed to delete customer.",
    };
  }
}