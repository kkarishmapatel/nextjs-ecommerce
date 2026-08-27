"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/validators/auth";

export async function registerUser(formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      error: "Email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(
    parsed.data.password,
    10
  );

  const user = await prisma.user.create({
  data: {
    name: parsed.data.name,
    email: parsed.data.email,
    password: hashedPassword,

    customer: {
      create: {},
    },
  },
  include: {
    customer: true,
  },
});

  return {
    success: true,
    user,
  };
}