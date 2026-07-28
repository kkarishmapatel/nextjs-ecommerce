"use client";

import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SelectOption } from "@/types/common";

type EmptyOption = {
  label: string;
  value: string;
};

type EntitySelectProps<
  TFieldValues extends FieldValues
> = {
  form: UseFormReturn<TFieldValues>;

  name: FieldPath<TFieldValues>;

  label: string;

  options: SelectOption[];

  placeholder?: string;

  emptyOption?: EmptyOption;

  disabled?: boolean;

  required?: boolean;
};

export default function EntitySelect<
  TFieldValues extends FieldValues
>({
  form,
  name,
  label,
  options,
  placeholder = "Select an option",
  emptyOption,
  disabled = false,
  required = false,
}: EntitySelectProps<TFieldValues>) {
 
 
  return (
    <div className="space-y-2">
      <Label htmlFor={String(name)}>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </Label>

      <Controller
        control={form.control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedOption = options.find(
            (option) => option.id === field.value
          );

          return (
            <>
              <Select
                disabled={disabled}
                value={
                  field.value
                    ? String(field.value)
                    : emptyOption
                      ? "__empty__"
                      : ""
                }
                onValueChange={(value) => {
                  field.onChange(
                    value === "__empty__"
                      ? emptyOption?.value ?? ""
                      : value
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    {selectedOption?.name ??
                      emptyOption?.label ??
                      placeholder}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {emptyOption && (
                    <SelectItem value="__empty__">
                      {emptyOption.label}
                    </SelectItem>
                  )}

                  {options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />

    </div>
  );
}