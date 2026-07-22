"use client";

import { useState } from "react";

import { createProduct } from "@/actions/product/createProduct";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductActions from "./ProductActions";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProductSchema,
  type CreateProductInput,
} from "@/validators/product";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");

    const result = await createProduct({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      shortDescription: formData.get("shortDescription") as string,
      description: formData.get("description") as string,
    });

    if (result.success) {
      setMessage("✅ Product created successfully.");
    } else {
      setMessage("❌ Failed to create product.");
      console.log(result.errors);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <ProductBasicInfo
        loading={loading}
        slugEdited={slugEdited}
        setSlugEdited={setSlugEdited}
      />

      <ProductActions loading={loading} />

      {message && (
        <p className="font-medium">
          {message}
        </p>
      )}
    </form>
  );
}