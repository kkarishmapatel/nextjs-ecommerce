"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateBrand } from "@/actions/brand/updateBrand";
import { generateSlug } from "@/lib/slug";

type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

type Props = {
  brand: Brand;
};

export default function BrandEditForm({
  brand,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [slugEdited, setSlugEdited] = useState(true);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(
      event.currentTarget
    );

    const result = await updateBrand(
      brand.id,
      {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description:
          formData.get("description") as string,
        sortOrder: Number(
          formData.get("sortOrder")
        ),
      }
    );

    if (result.success) {
      router.push("/admin/brands");
      return;
    }

    setMessage(
      "❌ Failed to update brand."
    );

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
          defaultValue={brand.name}
          className="w-full rounded border p-3"
          required
          onChange={(e) => {
            if (!slugEdited) {
              const slugInput =
                document.querySelector(
                  'input[name="slug"]'
                ) as HTMLInputElement;

              if (slugInput) {
                slugInput.value =
                  generateSlug(
                    e.target.value
                  );
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
          defaultValue={brand.slug}
          className="w-full rounded border p-3"
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
          defaultValue={
            brand.description ?? ""
          }
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
          min={0}
          defaultValue={brand.sortOrder}
          className="w-full rounded border p-3"
        />
      </div>

      <button
        disabled={loading}
        className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Updating..."
          : "Update Brand"}
      </button>

      {message && (
        <p className="font-medium">
          {message}
        </p>
      )}
    </form>
  );
}