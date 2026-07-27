"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProductSchema,
  type CreateProductInput,
} from "@/validators/product";

import { createProduct } from "@/actions/product/createProduct";

import ProductBasicInfo from "./ProductBasicInfo";
import ProductActions from "./ProductActions";
import { log } from "console";

export default function ProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),

    mode: "onBlur",

    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      brandId: "",
      status: "DRAFT",
    },
  });

  async function onSubmit(values: CreateProductInput) {
    setLoading(true);
    setMessage("");

    const result = await createProduct(values);

    if (result.success) {
      router.push("/admin/products");
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, errors]) => {
        if (!errors?.length) return;

        form.setError(field as keyof CreateProductInput, {
          type: "server",
          message: errors[0],
        });
      });
    }

    setMessage("❌ Failed to create product.");

    setLoading(false);
  }
  console.log("form slugEdited", slugEdited);
  // console.log("form setSlugEdited", setSlugEdited);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <ProductBasicInfo
        form={form}
        slugEdited={slugEdited}
        setSlugEdited={setSlugEdited}
      />
      <ProductActions
        loading={loading}
      />

      {message && (
        <p className="font-medium text-red-600">
          {message}
        </p>
      )}
    </form>
  );
}