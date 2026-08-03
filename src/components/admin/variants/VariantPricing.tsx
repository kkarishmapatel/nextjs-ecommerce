import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  CreateVariantInput,
} from "@/validators/variant";

type Props = {
  form: UseFormReturn<CreateVariantInput>;
};

export default function VariantPricing({
  form,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <Label>Price</Label>

        <Input
          type="number"
          step="0.01"
          {...form.register("price", {
            valueAsNumber: true,
          })}
        />

        <p className="mt-1 text-sm text-red-600">
          {form.formState.errors.price?.message}
        </p>
      </div>

      <div>
        <Label>Compare At Price</Label>

        <Input
          type="number"
          step="0.01"
          {...form.register("compareAtPrice", {
            valueAsNumber: true,
          })}
        />

        <p className="mt-1 text-sm text-red-600">
          {form.formState.errors.compareAtPrice?.message}
        </p>
      </div>

      <div>
        <Label>Cost Price</Label>

        <Input
          type="number"
          step="0.01"
          {...form.register("costPrice", {
            valueAsNumber: true,
          })}
        />

        <p className="mt-1 text-sm text-red-600">
          {form.formState.errors.costPrice?.message}
        </p>
      </div>
    </div>
  );
}