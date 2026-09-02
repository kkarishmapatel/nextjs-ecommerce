"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  updateCustomerSchema,
} from "@/lib/customers/customerSchema";

export async function updateCustomer(
  customerId: string,
  input: unknown
) {
  const parsed =
    updateCustomerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid customer data.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    email,
    password,
    role,
  } = parsed.data;

  try {
    // Find the customer and related user
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

    // Check whether another user already
    // uses this email.
    const existingUser =
      await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: customer.userId,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingUser) {
      return {
        success: false,
        error:
          "A user with this email already exists.",
      };
    }

    // Prepare User update data
    const userData: {
      name: string;
      email: string;
      role: "CUSTOMER" | "ADMIN";
      password?: string;
    } = {
      name,
      email,
      role,
    };

    // Only update password if a new one
    // was provided.
    if (password) {
      userData.password =
        await bcrypt.hash(password, 12);
    }

    const updatedCustomer =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.update({
              where: {
                id: customer.userId,
              },
              data: userData,
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            });

          const updated =
            await tx.customer.findUnique({
              where: {
                id: customer.id,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            });

          return updated;
        }
      );

    return {
      success: true,
      customer: updatedCustomer,
    };
  } catch (error) {
    console.error(
      "Failed to update customer:",
      error
    );

    return {
      success: false,
      error: "Failed to update customer.",
    };
  }
}