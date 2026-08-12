import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  CreateVariantFormInput,
  CreateVariantInput,
} from "@/validators/variant";

type Props = {
   form: UseFormReturn<
    CreateVariantFormInput,
    undefined,
    CreateVariantInput
  >;
};

export default function VariantBasicInfo({
  form,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Label htmlFor="sku">
          SKU
        </Label>

        <Input
          id="sku"
          placeholder="SKU-001"
          {...form.register("sku")}
        />

        {form.formState.errors.sku && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.sku.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="barcode">
          Barcode
        </Label>

        <Input
          id="barcode"
          placeholder="123456789012"
          {...form.register("barcode")}
        />

        {form.formState.errors.barcode && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.barcode.message}
          </p>
        )}
      </div>
    </div>
  );
}