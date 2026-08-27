"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    createCustomerAddress,
} from "@/actions/customer/createCustomerAddress";
import {
    updateCustomerAddress,
} from "@/actions/customer/updateCustomerAddress";


type CustomerAddress = {
    id: string;
    firstName: string;
    lastName: string;
    company: string | null;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
    isDefault: boolean;
};

type CustomerAddressFormProps = {
    customerId: string;
    address?: CustomerAddress;
    onSuccess?: () => void;
};

export default function CustomerAddressForm({
    customerId,
    address,
    onSuccess,
}: CustomerAddressFormProps) {
    const router = useRouter();
    const isEdit = Boolean(address);

    const [formData, setFormData] = useState({
        firstName: address?.firstName ?? "",
        lastName: address?.lastName ?? "",
        company: address?.company ?? "",
        address1: address?.address1 ?? "",
        address2: address?.address2 ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        postalCode: address?.postalCode ?? "",
        country: address?.country ?? "IN",
        phone: address?.phone ?? "",
        isDefault: address?.isDefault ?? false,
    });

    const [error, setError] = useState<string | null>(
        null
    );

    const [fieldErrors, setFieldErrors] = useState<
        Record<string, string[]>
    >({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement
        >
    ) {
        const { name, value, type, checked } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const result = isEdit
                ? await updateCustomerAddress(
                    customerId,
                    address!.id,
                    formData
                )
                : await createCustomerAddress(
                    customerId,
                    formData
                );

            if (!result.success) {
                setError(result.error);

                if (result.fieldErrors) {
                    setFieldErrors(
                        result.fieldErrors as Record<
                            string,
                            string[]
                        >
                    );
                }

                return;
            }

            onSuccess?.();
            router.refresh();
            
        } catch (error) {
            console.error(error);

            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function getFieldError(
        field: string
    ) {
        return fieldErrors[field]?.[0];
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg border p-6"
        >
            <div>
                <h2 className="text-lg font-semibold">
                    {isEdit
                        ? "Edit Address"
                        : "Add Address"}
                </h2>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        First Name
                    </label>

                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {getFieldError("firstName") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("firstName")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Last Name
                    </label>

                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {getFieldError("lastName") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("lastName")}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Company
                </label>

                <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Address Line 1
                </label>

                <input
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                />

                {getFieldError("address1") && (
                    <p className="mt-1 text-sm text-red-600">
                        {getFieldError("address1")}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Address Line 2
                </label>

                <input
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        City
                    </label>

                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {getFieldError("city") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("city")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        State
                    </label>

                    <input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {getFieldError("state") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("state")}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Postal Code
                    </label>

                    <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                    />

                    {getFieldError("postalCode") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("postalCode")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Country
                    </label>

                    <input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        maxLength={2}
                        className="w-full rounded-md border px-3 py-2 uppercase"
                    />

                    {getFieldError("country") && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError("country")}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Phone
                </label>

                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                />
            </div>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                />

                <span className="text-sm">
                    Set as default address
                </span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md border px-4 py-2 disabled:opacity-50"
            >
                {isSubmitting
                    ? "Saving..."
                    : isEdit
                        ? "Update Address"
                        : "Add Address"}
            </button>
        </form>
    );
}