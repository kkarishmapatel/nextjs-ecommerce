"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAttributeSchema,
  type CreateAttributeInput,
} from "@/validators/attribute";

import { createAttribute } from "@/actions/attribute/createAttribute";
import { updateAttribute } from "@/actions/attribute/updateAttribute";

import { generateSlug } from "@/lib/slug";

import FormSection from "@/components/common/forms/FormSection";
import FormActions from "@/components/common/forms/FormActions";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type AttributeData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type Props = {
  initialData?: AttributeData;
};

export default function AttributeForm({
  initialData,
}: Props) {
  const router = useRouter();

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const form =
    useForm<CreateAttributeInput>({
      resolver: zodResolver(
        createAttributeSchema
      ),

      defaultValues: {
        name: initialData?.name ?? "",
        slug: initialData?.slug ?? "",
        isActive:
          initialData?.isActive ?? true,
      },
    });

  async function onSubmit(
    values: CreateAttributeInput
  ) {
    setLoading(true);
    setMessage("");

    const result = initialData
      ? await updateAttribute(
          initialData.id,
          values
        )
      : await createAttribute(values);

    if (result.success) {
      router.push("/admin/attributes");
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(
        ([field, errors]) => {
          if (!errors?.length) return;

          form.setError(
            field as keyof CreateAttributeInput,
            {
              type: "server",
              message: errors[0],
            }
          );
        }
      );
    }

    setMessage(
      "Failed to save attribute."
    );

    setLoading(false);
  }

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      <FormSection title="Basic Information">
        <div>
          <Label>
            Name
          </Label>

          <Input
            {...form.register("name")}
            placeholder="Color"
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

        <div>
          <Label>
            Slug
          </Label>

          <Input
            {...form.register("slug")}
            placeholder="color"
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

        <div className="flex items-center gap-3">
          <Checkbox
            checked={form.watch("isActive")}
            onCheckedChange={(
              checked
            ) =>
              form.setValue(
                "isActive",
                checked === true
              )
            }
          />

          <Label>
            Active
          </Label>
        </div>
      </FormSection>

      <FormActions
        loading={loading}
        submitLabel={
          initialData
            ? "Update Attribute"
            : "Save Attribute"
        }
      />

      {message && (
        <p className="text-red-600">
          {message}
        </p>
      )}
    </form>
  );
}