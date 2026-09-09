"use server";

import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import {
  updateCustomerProfileSchema,
  type UpdateCustomerProfileInput,
} from "@/lib/customers/customerProfileSchema";

export async function updateCustomerProfile(
  input: UpdateCustomerProfileInput
) {
  try {
    // Get the currently logged-in customer.
    const customer = await getCurrentCustomer();

    if (!customer) {
      return {
        success: false,
        error: "You must be logged in.",
      };
    }

    // Validate the submitted data.
    const parsed =
      updateCustomerProfileSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ??
          "Invalid profile data.",
      };
    }

    const {
      name,
      email,
      password,
    } = parsed.data;

    // Check whether another user already
    // uses this email address.
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

    // Prepare data for the User update.
    const updateData: {
      name: string;
      email: string;
      password?: string;
    } = {
      name,
      email,
    };

    // Only update the password when one was provided.
    if (password) {
      updateData.password = await hash(
        password,
        12
      );
    }

    await prisma.user.update({
      where: {
        id: customer.userId,
      },
      data: updateData,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to update customer profile:",
      error
    );

    return {
      success: false,
      error:
        "Failed to update your profile.",
    };
  }
}