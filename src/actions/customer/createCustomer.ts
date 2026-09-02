"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  createCustomerSchema,
} from "@/lib/customers/customerSchema";

export async function createCustomer(
  input: unknown
) {
  const parsed =
    createCustomerSchema.safeParse(input);

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
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
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

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const customer =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.create({
              data: {
                name,
                email,
                password: hashedPassword,
                role,
              },
            });

          const customer =
            await tx.customer.create({
              data: {
                userId: user.id,
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

          return customer;
        }
      );

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error(
      "Failed to create customer:",
      error
    );

    return {
      success: false,
      error: "Failed to create customer.",
    };
  }
}