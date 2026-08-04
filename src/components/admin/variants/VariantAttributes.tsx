"use client";

import { Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AttributeLookup } from "@/types/attribute";

import type {
  CreateVariantInput,
} from "@/validators/variant";

import type {
  UseFormReturn,
} from "react-hook-form";

type Props = {
  form: UseFormReturn<CreateVariantInput>;

  attributes: AttributeLookup[];
};

export default function VariantAttributes({
  form,
  attributes,
}: Props) {
  console.log(
    "Variant Attributes 2:",
    attributes
  );
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Attributes 2
      </h3>

      {attributes.map((attribute) => (
        <Controller
          key={attribute.id}
          control={form.control}
          name="selectedAttributes"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>
                {attribute.name}
              </Label>

              <Select
                value={
                  field.value?.[attribute.id] ??
                  ""
                }
                onValueChange={(value) => {
                  field.onChange({
                    ...field.value,
                    [attribute.id]: value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${attribute.name}`}
                  />
                </SelectTrigger>

                <SelectContent>
                  {attribute.values.map((value) => (
                    <SelectItem
                      key={value.id}
                      value={value.id}
                    >
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      ))}
    </div>
  );
}