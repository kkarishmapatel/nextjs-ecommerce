"use client";

import { Controller, type FieldPath, type FieldValues, type UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";

import type { SelectOption } from "@/types/common";

type EntityMultiSelectProps<
    TFieldValues extends FieldValues
> = {
    form: UseFormReturn<TFieldValues>;

    name: FieldPath<TFieldValues>;

    label: string;

    options: SelectOption[];

    placeholder?: string;

    disabled?: boolean;

    required?: boolean;
};

export default function EntityMultiSelect<
    TFieldValues extends FieldValues
>({
    form,
    name,
    label,
    options,
    placeholder = "Select options",
    disabled = false,
    required = false,
}: EntityMultiSelectProps<TFieldValues>) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState }) => {
                const selectedValues = (field.value ?? []) as string[];

                const selectedOptions = options.filter((option) =>
                    selectedValues.includes(option.id)
                );

                function toggleValue(value: string) {
                    if (selectedValues.includes(value)) {
                        field.onChange(
                            selectedValues.filter((v) => v !== value)
                        );
                    } else {
                        field.onChange([
                            ...selectedValues,
                            value,
                        ]);
                    }
                }

                function removeValue(value: string) {
                    field.onChange(
                        selectedValues.filter((v) => v !== value)
                    );
                }

                return (
                    <div className="space-y-2">
                        <Label>
                            {label}

                            {required && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </Label>

                        <Popover
                            open={open}
                            onOpenChange={setOpen}
                        >
                            <PopoverTrigger
                                render={
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={disabled}
                                        className="flex w-full items-center justify-between"
                                    />
                                }
                            >
                                <span className="truncate">
                                    {selectedOptions.length > 0
                                        ? `${selectedOptions.length} selected`
                                        : placeholder}
                                </span>

                                <ChevronDown className="h-4 w-4 opacity-60" />
                            </PopoverTrigger>

                            <PopoverContent
                                align="start"
                                className="w-[320px] p-2"
                            >
                                <div className="space-y-1">
                                    {options.map((option) => {
                                        const checked =
                                            selectedValues.includes(option.id);

                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() =>
                                                    toggleValue(option.id)
                                                }
                                                className="flex w-full items-center gap-3 rounded px-2 py-2 hover:bg-muted"
                                            >
                                                <Checkbox checked={checked} />

                                                <span className="flex-1 text-left">
                                                    {option.name}
                                                </span>

                                                {checked && (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {selectedOptions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedOptions.map((option) => (
                                    <Badge
                                        key={option.id}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {option.name}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeValue(option.id)
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {fieldState.error && (
                            <p className="text-sm text-red-600">
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}