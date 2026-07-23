"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteBrand } from "@/actions/brand/deleteBrand";

type Props = {
  brandId: string;
};

export default function DeleteBrandButton({
  brandId,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this brand?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteBrand(
        brandId
      );

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
    >
      {isPending
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}