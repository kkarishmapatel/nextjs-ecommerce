import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is required.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPG, PNG, WebP, and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Image size must be 5 MB or less.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      "jpg";

    const filename =
      `${randomUUID()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      "variants"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      filename
    );

    const bytes = await file.arrayBuffer();

    await writeFile(
      filePath,
      Buffer.from(bytes)
    );

    const url =
      `/uploads/products/variants/${filename}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error(
      "Product image upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}