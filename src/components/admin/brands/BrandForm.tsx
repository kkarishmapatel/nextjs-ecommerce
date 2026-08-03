"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createBrand } from "@/actions/brand/createBrand";
import { generateSlug } from "@/lib/slug";
import FormActions from "@/components/common/forms/FormActions";

export default function BrandForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [slugEdited, setSlugEdited] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const result = await createBrand({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      sortOrder: Number(
        formData.get("sortOrder")
      ),
    });

    if (result.success) {
      router.push("/admin/brands");
      return;
    }

    setMessage("❌ Failed to create brand.");

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block font-medium">
          Brand Name
        </label>

        <input
          name="name"
          className="w-full rounded border p-3"
          placeholder="Nike"
          required
          onChange={(e) => {
            if (!slugEdited) {
              const slugInput =
                document.querySelector(
                  'input[name="slug"]'
                ) as HTMLInputElement;

              if (slugInput) {
                slugInput.value =
                  generateSlug(e.target.value);
              }
            }
          }}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Slug
        </label>

        <input
          name="slug"
          className="w-full rounded border p-3"
          placeholder="nike"
          required
          onChange={() =>
            setSlugEdited(true)
          }
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          name="description"
          className="w-full rounded border p-3"
          rows={4}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Sort Order
        </label>

        <input
          name="sortOrder"
          type="number"
          defaultValue={0}
          min={0}
          className="w-full rounded border p-3"
        />
      </div>

      <FormActions
        loading={loading}
        submitLabel="Save Brand"
        message={message}
        cancelHref="/admin/brands"
      />
    </form>
  );
}