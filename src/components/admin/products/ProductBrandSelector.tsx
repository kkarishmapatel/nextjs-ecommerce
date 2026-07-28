"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    type CreateProductInput,
} from "@/validators/product";

type Brand = {
    id: string;
    name: string;
};

type Props = {
    form: UseFormReturn<CreateProductInput>;
    brands: Brand[];
};

export default function ProductBrandSelector({
    form,
    brands,
}: Props) {
    return (
        <div>
            <Label htmlFor="brand">
                Brand
            </Label>

            <Controller
                control={form.control}
                name="brandId"
                render={({ field }) => (
                    <Select
                        value={field.value || "none"}
                        onValueChange={(value) => {
                            field.onChange(
                                value === "none" ? "" : value
                            );
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue>
                                {field.value
                                    ? brands.find(
                                        (brand) => brand.id === field.value
                                    )?.name
                                    : "Select a brand"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="none">
                                No Brand
                            </SelectItem>

                            {brands.map((brand) => (
                                <SelectItem
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

            {form.formState.errors.brandId && (
                <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.brandId.message}
                </p>
            )}
        </div>
    );
}