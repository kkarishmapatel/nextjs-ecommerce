import { UseFormReturn } from "react-hook-form";

import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";

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

export default function VariantInventory({
  form,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label>
            Stock
          </Label>

          <Input
            type="number"
            {...form.register("stock", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Label>
            Low Stock Threshold
          </Label>

          <Input
            type="number"
            {...form.register(
              "lowStockThreshold",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>
      </div>

      <Controller
        control={form.control}
        name="trackInventory"
        render={({ field }) => (
          <label className="flex items-center gap-3">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            Track Inventory
          </label>
        )}
      />

      <Controller
        control={form.control}
        name="allowBackorders"
        render={({ field }) => (
          <label className="flex items-center gap-3">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            Allow Backorders
          </label>
        )}
      />

      <Controller
        control={form.control}
        name="isDefault"
        render={({ field }) => (
          <label className="flex items-center gap-3">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            Default Variant
          </label>
        )}
      />

      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <label className="flex items-center gap-3">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            Active
          </label>
        )}
      />
    </div>
  );
}