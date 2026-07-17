"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function logoutUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        token,
      },
    });
  }

  cookieStore.delete("session");

  redirect("/login");
}