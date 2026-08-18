"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { setDefaultVariant } from "@/actions/variant/setDefaultVariant";
import {
  toggleVariantStatus,
} from "@/actions/variant/toggleVariantStatus";
import {
  deleteVariant,
} from "@/actions/variant/deleteVariant";

type VariantActionsProps = {
  productId: string;
  variantId: string;
  isDefault: boolean;
  isActive: boolean;
};

export function VariantActions({
  productId,
  variantId,
  isDefault,
  isActive,
}: VariantActionsProps) {
  const router = useRouter();

  const [isSettingDefault, setIsSettingDefault] =
    useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);

  async function handleToggleStatus() {
    if (isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);

    const result =
      await toggleVariantStatus(
        productId,
        variantId
      );

    if (!result.success) {
      alert(result.error);
      setIsUpdatingStatus(false);
      return;
    }

    router.refresh();
    setIsUpdatingStatus(false);
  }

  async function handleSetDefault() {
    if (isSettingDefault) {
      return;
    }

    setIsSettingDefault(true);

    const result =
      await setDefaultVariant(
        productId,
        variantId
      );

    if (!result.success) {
      alert(result.error);
      setIsSettingDefault(false);
      return;
    }

    router.refresh();
    setIsSettingDefault(false);
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const result = await deleteVariant(
      productId,
      variantId
    );

    if (!result.success) {
      alert(result.error);
      setIsDeleting(false);
      return;
    }

    router.push(
      `/admin/products/${productId}/variants`
    );

    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/products/${productId}/variants/${variantId}/edit`}
        className="rounded-md border px-4 py-2 text-sm"
      >
        Edit Variant
      </Link>

      {!isDefault && (
        <button
          type="button"
          onClick={handleSetDefault}
          disabled={isSettingDefault}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
        >
          {isSettingDefault
            ? "Setting..."
            : "Set as Default"}
        </button>
      )}

      <button
        type="button"
        onClick={handleToggleStatus}
        disabled={isUpdatingStatus}
        className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
      >
        {isUpdatingStatus
          ? "Updating..."
          : isActive
            ? "Deactivate"
            : "Activate"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md border px-4 py-2 text-sm text-red-600 disabled:opacity-50"
      >
        {isDeleting
          ? "Deleting..."
          : "Delete"}
      </button>
    </div>
  );
}