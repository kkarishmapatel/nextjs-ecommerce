"use client";

import { useState } from "react";
import { createProduct } from "@/actions/product/createProduct";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Create Product
      </h1>

      <form action={handleSubmit} className="space-y-6">

        <div>
          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            name="name"
            className="w-full rounded border p-3"
            placeholder="Nike Air Max"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Slug
          </label>

          <input
            name="slug"
            className="w-full rounded border p-3"
            placeholder="nike-air-max"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Short Description
          </label>

          <textarea
            name="shortDescription"
            className="w-full rounded border p-3"
            rows={3}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            name="description"
            className="w-full rounded border p-3"
            rows={6}
          />
        </div>

        <button
          disabled={loading}
          className="rounded bg-black px-6 py-3 text-white"
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>

        {message && (
          <p className="font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}