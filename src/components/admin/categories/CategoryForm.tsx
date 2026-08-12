"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategory } from "@/actions/category/updateCategory";
import { z } from "zod";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/validators/category";

import { createCategory } from "@/actions/category/createCategory";

import { generateSlug } from "@/lib/slug";

import {
  Label,
} from "@/components/ui/label";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";


import EntitySelect from "@/components/common/forms/EntitySelect";
import FormActions from "@/components/common/forms/FormActions";

type ParentCategory = {
  id: string;
  name: string;
};

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  parentId: string | null;
};

type Props = {
  parentCategories: ParentCategory[];
  initialData?: CategoryData;
};

export default function CategoryForm({
  parentCategories,
  initialData,
}: Props) {
  const router = useRouter();

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const form = useForm<
  z.input<typeof createCategorySchema>,
  undefined,
  z.output<typeof createCategorySchema>
>({
  resolver: zodResolver(
    createCategorySchema
  ),

  defaultValues: {
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    sortOrder: initialData?.sortOrder ?? 0,
    parentId: initialData?.parentId ?? undefined,
  },
});


  async function onSubmit(
    values: CreateCategoryInput
  ) {
    setLoading(true);
    setMessage("");

    const result = initialData
      ? await updateCategory(initialData.id, values)
      : await createCategory(values);

    if (result.success) {
      router.push("/admin/categories");
      return;
    }


    setMessage(
      "❌ Failed to create category."
    );

    setLoading(false);
  }


  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* Name */}
      <div>
        <Label>
          Category Name
        </Label>

        <Input
          placeholder="Electronics"
          {...form.register("name")}
          onChange={(event) => {

            form.setValue(
              "name",
              event.target.value
            );


            if (!slugEdited) {
              form.setValue(
                "slug",
                generateSlug(
                  event.target.value
                )
              );
            }
          }}
        />


        <p className="text-sm text-red-600">
          {
            form.formState.errors.name
              ?.message
          }
        </p>
      </div>



      {/* Slug */}
      <div>
        <Label>
          Slug
        </Label>

        <Input
          placeholder="electronics"
          {...form.register("slug")}
          onChange={(event) => {

            setSlugEdited(true);

            form.setValue(
              "slug",
              event.target.value
            );
          }}
        />


        <p className="text-sm text-red-600">
          {
            form.formState.errors.slug
              ?.message
          }
        </p>
      </div>



      {/* Parent Category */}
      <EntitySelect
        form={form}
        name="parentId"
        label="Parent Category"
        placeholder="Select parent category"
        options={parentCategories}
        emptyOption={{
          label: "No Parent",
          value: "",
        }}
      />




      {/* Description */}
      <div>
        <Label>
          Description
        </Label>


        <Textarea
          rows={4}
          {...form.register(
            "description"
          )}
        />


        <p className="text-sm text-red-600">
          {
            form.formState.errors.description
              ?.message
          }
        </p>

      </div>




      {/* Sort Order */}
      <div>
        <Label>
          Sort Order
        </Label>


        <Input
          type="number"
          min="0"
          {...form.register(
            "sortOrder",
            {
              valueAsNumber: true,
            }
          )}
        />


        <p className="text-sm text-red-600">
          {
            form.formState.errors.sortOrder
              ?.message
          }
        </p>

      </div>



      <FormActions
        loading={loading}
        submitLabel={
          initialData
            ? "Update Category"
            : "Save Category"
        }
        message={message}
        cancelHref="/admin/categories"
      />


    </form>
  );
}