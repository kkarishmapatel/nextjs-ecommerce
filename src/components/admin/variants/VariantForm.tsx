"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createVariantSchema,
    type CreateVariantInput,
} from "@/validators/variant";

import FormSection from "@/components/common/forms/FormSection";
import FormActions from "@/components/common/forms/FormActions";
import { createVariant } from "@/actions/variant/createVariant";
import VariantBasicInfo from "./VariantBasicInfo";
import VariantPricing from "./VariantPricing";
import VariantInventory from "./VariantInventory";
import { useRouter } from "next/navigation";
type Props = {
    productId: string;
};
export default function VariantForm({ productId }: Props) {
    const [loading, setLoading] =
        useState(false);
    const router = useRouter();
    const [message, setMessage] =
        useState("");

    const form =
        useForm<CreateVariantInput>({
            resolver: zodResolver(
                createVariantSchema
            ),

            defaultValues: {
                sku: "",

                barcode: "",

                price: 0,

                compareAtPrice: null,

                costPrice: null,

                stock: 0,

                trackInventory: true,

                allowBackorders: false,

                lowStockThreshold: 5,

                isDefault: false,

                isActive: true,
            },
        });

    async function onSubmit(
        values: CreateVariantInput
    ) {
        setLoading(true);
        setMessage("");

        const result =
            await createVariant({
                productId,
                ...values,
            });

        if (result.success) {
            router.push(
                `/admin/products/${productId}/variants`
            );
            return;
        }

        if (result.errors) {
            Object.entries(result.errors).forEach(
                ([field, errors]) => {
                    if (!errors?.length) return;

                    form.setError(
                        field as keyof CreateVariantInput,
                        {
                            type: "server",
                            message: errors[0],
                        }
                    );
                }
            );
        }

        setMessage(
            "❌ Failed to create variant."
        );

        setLoading(false);
    }

    return (
        <form
            onSubmit={form.handleSubmit(
                onSubmit
            )}
            className="space-y-6"
        >
            <FormSection
                title="Basic Information"
                description="SKU and barcode."
            >
                <VariantBasicInfo
                    form={form}
                />
            </FormSection>

            <FormSection
                title="Pricing"
                description="Selling price information."
            >
                <VariantPricing
                    form={form}
                />
            </FormSection>

            <FormSection
                title="Inventory"
                description="Stock management."
            >
                <VariantInventory
                    form={form}
                />
            </FormSection>

            <FormActions
                loading={loading}
                submitLabel="Save Variant"
                message={message}
            />
        </form>
    );
}