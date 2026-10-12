"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/validators/auth";

export type RegisterState = {
  error: string | null;
};

export async function registerUser(
  _previousState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check your registration details.",
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      error: "Email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(
    parsed.data.password,
    10
  );

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      customer: {
        create: {},
      },
    },
  });

  redirect("/login?registered=1");
}