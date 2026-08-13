"use server";

import { unlink } from "fs/promises";
import path from "path";

import { prisma } from "@/lib/prisma";

export async function deleteProductImage(
  imageId: string
) {
  const image =
    await prisma.productImage.findUnique({
      where: {
        id: imageId,
      },
    });

  if (!image) {
    return {
      success: false,
      error: "Image not found.",
    };
  }

  // Delete database record first
  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  // Delete local file if this is one of our
  // locally uploaded images.
  if (
    image.url.startsWith(
      "/uploads/products/variants/"
    )
  ) {
    const filename = path.basename(
      image.url
    );

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      "variants",
      filename
    );

    try {
      await unlink(filePath);
    } catch (error) {
      console.warn(
        "Image file could not be deleted:",
        filePath,
        error
      );
    }
  }

  return {
    success: true,
  };
}