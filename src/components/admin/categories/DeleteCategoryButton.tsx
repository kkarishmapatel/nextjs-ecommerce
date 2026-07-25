"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteCategory } from "@/actions/category/deleteCategory";

type Props = {
  categoryId: string;
};

export default function DeleteCategoryButton({
  categoryId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await deleteCategory(categoryId);

    if (!result.success) {
      alert(result.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="ml-4 text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}