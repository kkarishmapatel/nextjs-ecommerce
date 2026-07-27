"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import {
  type CreateProductInput,
} from "@/validators/product";

import { generateSlug } from "@/lib/slug";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


type Props = {
  form: UseFormReturn<CreateProductInput>;
  slugEdited: boolean;
  setSlugEdited: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};


export default function ProductBasicInfo({
  form,
  slugEdited,
  setSlugEdited,
}: Props) {

  return (
    <div className="space-y-6">

      {/* Product Name */}
      <div>
        <Label htmlFor="name">
          Product Name
        </Label>

        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Nike Air Max"
              value={field.value}
              onChange={(event) => {
                const value =
                  event.target.value;

                field.onChange(value);

                if (!slugEdited) {
                  form.setValue(
                    "slug",
                    generateSlug(value),
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                }
              }}
            />
          )}
        />

        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {
              form.formState.errors.name
                .message
            }
          </p>
        )}
      </div>


      {/* Slug */}
      <div>
        <Label htmlFor="slug">
          Slug
        </Label>

        <Controller
          control={form.control}
          name="slug"
          render={({ field }) => (
            <Input
              id="slug"
              placeholder="nike-air-max"
              value={field.value}
              onChange={(event) => {
                setSlugEdited(true);

                field.onChange(
                  event.target.value
                );
              }}
            />
          )}
        />

        {form.formState.errors.slug && (
          <p className="mt-1 text-sm text-red-600">
            {
              form.formState.errors.slug
                .message
            }
          </p>
        )}
      </div>


      {/* Short Description */}
      <div>
        <Label htmlFor="shortDescription">
          Short Description
        </Label>

        <Controller
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <Textarea
              id="shortDescription"
              rows={3}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />

        {form.formState.errors
          .shortDescription && (
          <p className="mt-1 text-sm text-red-600">
            {
              form.formState.errors
                .shortDescription
                .message
            }
          </p>
        )}
      </div>


      {/* Description */}
      <div>
        <Label htmlFor="description">
          Description
        </Label>

        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <Textarea
              id="description"
              rows={6}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />

        {form.formState.errors
          .description && (
          <p className="mt-1 text-sm text-red-600">
            {
              form.formState.errors
                .description
                .message
            }
          </p>
        )}
      </div>

    </div>
  );
}