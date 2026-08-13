"use server";

import { unlink } from "fs/promises";
import path from "path";

export async function deleteUploadedProductImage(
  url: string
) {
  if (
    !url.startsWith(
      "/uploads/products/variants/"
    )
  ) {
    return {
      success: false,
      error: "Invalid local image URL.",
    };
  }

  const filename = path.basename(url);

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

    return {
      success: true,
    };
  } catch (error) {
    console.warn(
      "Failed to remove uploaded file:",
      filePath,
      error
    );

    return {
      success: false,
      error: "Failed to remove uploaded file.",
    };
  }
}