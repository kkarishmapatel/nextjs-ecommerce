"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EntityMultiSelect from "@/components/common/forms/EntityMultiSelect";
import EntitySelect from "@/components/common/forms/EntitySelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateProductFormInput,
  createProductSchema,
  type CreateProductInput,
} from "@/validators/product";

import { createProduct } from "@/actions/product/createProduct";
import { updateProduct } from "@/actions/product/updateProduct";

import ProductBasicInfo from "./ProductBasicInfo";
import type { ProductLookupData } from "@/types/product";
import FormSection from "@/components/common/forms/FormSection";
import FormActions from "@/components/common/forms/FormActions";

type ProductFormValues = CreateProductInput;

type Props = {
  lookupData: ProductLookupData;
  product?: ProductFormValues & {
    id: string;
  };
};

export default function ProductForm({
  lookupData,
  product,
}: Props) {
  const router = useRouter();

  const isEditMode = Boolean(product);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [slugEdited, setSlugEdited] = useState(
    isEditMode
  );

  const form = useForm<
    CreateProductFormInput,
    undefined,
    CreateProductInput
  >({
    resolver: zodResolver(createProductSchema),

    mode: "onBlur",

    defaultValues: product
      ? {
        name: product.name,
        slug: product.slug,
        shortDescription:
          product.shortDescription ?? "",
        description: product.description ?? "",
        brandId: product.brandId ?? "",
        status: product.status,
        categoryIds: product.categoryIds,
      }
      : {
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        brandId: "",
        status: "ACTIVE",
        categoryIds: [],
      },
  });

  async function onSubmit(
    values: CreateProductInput
  ) {
    setLoading(true);
    setMessage("");

    try {
      const result = product
        ? await updateProduct(product.id, values)
        : await createProduct(values);

      if (result.success) {
        router.push("/admin/products");
        return;
      }

      if (result.errors) {
        Object.entries(result.errors).forEach(
          ([field, errors]) => {
            if (!errors?.length) return;

            if (field === "_form") {
              setMessage(errors[0]);
              return;
            }

            form.setError(
              field as keyof CreateProductInput,
              {
                type: "server",
                message: errors[0],
              }
            );
          }
        );
      }

      setMessage(
        isEditMode
          ? "Failed to update product."
          : "Failed to create product."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        isEditMode
          ? "Failed to update product."
          : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Basic Information"
        description="General product information."
      >
        <ProductBasicInfo
          form={form}
          slugEdited={slugEdited}
          setSlugEdited={setSlugEdited}
        />
      </FormSection>

      <FormSection
        title="Organization"
        description="Brand and category assignments."
      >
        <EntitySelect
          form={form}
          name="brandId"
          label="Brand"
          placeholder="Select a brand"
          options={lookupData.brands}
        />

        <EntityMultiSelect
          form={form}
          name="categoryIds"
          label="Categories"
          options={lookupData.categories}
          placeholder="Select categories"
        />
      </FormSection>

      <FormSection
        title="Status"
        description="Control the product's visibility and availability."
      >
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium"
          >
            Product Status
          </label>

          <select
            id="status"
            {...form.register("status")}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>

          {form.formState.errors.status && (
            <p className="text-sm text-red-600">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>
      </FormSection>

      <FormActions
        loading={loading}
        submitLabel={
          isEditMode
            ? "Save Changes to Product"
            : "Save Product"
        }
        message={message}
        cancelHref="/admin/products"
      />
    </form>
  );
}
