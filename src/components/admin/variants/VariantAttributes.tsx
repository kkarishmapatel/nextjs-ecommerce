"use client";

import { UseFormReturn } from "react-hook-form";

import EntitySelect from "@/components/common/forms/EntitySelect";

import type {
  VariantAttributeLookup,
} from "@/types/variant";

import type {
  CreateVariantFormInput,
  CreateVariantInput,
} from "@/validators/variant";

type Props = {
   form: UseFormReturn<
    CreateVariantFormInput,
    undefined,
    CreateVariantInput
  >;
  attributes: VariantAttributeLookup[];
};

export default function VariantAttributes({
  form,
  attributes,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Attributes
      </h2>

      {attributes.map((attribute, index) => (
        <EntitySelect
          key={attribute.id}
          form={form}
          name={
            `selectedAttributes.${index}.attributeValueId`
          }
          label={attribute.name}
          placeholder={`Select ${attribute.name}`}
          options={attribute.values}
        />
      ))}
    </div>
  );
}