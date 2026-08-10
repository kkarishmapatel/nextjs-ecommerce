"use client";

import { useEffect, useState } from "react";

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
import type {
    AttributeLookup,
} from "@/types/attribute";

import VariantAttributes from "./VariantAttributes";
import { VariantLookupData } from "@/types/variant";
import { updateVariant } from "@/actions/variant/updateVariant";
type VariantInitialData = {
    id: string;

    productId: string;

    sku: string;
    barcode: string | null;

    price: string;
    compareAtPrice: string;

    stock: number;

    weight: string;

    isActive: boolean;

    isDefault: boolean;

    selectedAttributes: {
        attributeId: string;
        attributeValueId: string;
    }[];
};

type Props = {
    productId: string;

    lookupData: VariantLookupData;

    initialData?: VariantInitialData;
};

export default function VariantForm({ productId, lookupData, initialData }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [message, setMessage] = useState("");

    const form = useForm<CreateVariantInput>({
        resolver: zodResolver(createVariantSchema),

        defaultValues: {

            sku:
                initialData?.sku ?? "",

            barcode:
                initialData?.barcode ?? "",

            price:
                initialData
                    ? Number(initialData.price)
                    : 0,

            compareAtPrice:
                initialData?.compareAtPrice
                    ? Number(
                        initialData.compareAtPrice
                    )
                    : undefined,

            stock:
                initialData?.stock ?? 0,
            isActive:
                initialData?.isActive ?? true,

            isDefault:
                initialData?.isDefault ?? false,

            selectedAttributes:
                initialData?.selectedAttributes ?? [],
        },


    });

    useEffect(() => {
        if (initialData) {
            form.setValue(
                "selectedAttributes",
                lookupData.attributes.map(
                    (attribute) => {
                        const existing =
                            initialData.selectedAttributes.find(
                                (item) =>
                                    item.attributeId ===
                                    attribute.id
                            );

                        return {
                            attributeId: attribute.id,

                            attributeValueId:
                                existing?.attributeValueId ?? "",
                        };
                    }
                )
            );

            return;
        }

        form.setValue(
            "selectedAttributes",
            lookupData.attributes.map(
                (attribute) => ({
                    attributeId: attribute.id,
                    attributeValueId: "",
                })
            )
        );
    }, [
        form,
        lookupData.attributes,
        initialData,
    ]);


    async function onSubmit(
        values: CreateVariantInput
    ) {
        setLoading(true);
        setMessage("");

        const result = initialData
            ? await updateVariant(
                initialData.id,
                productId,
                values
            )
            : await createVariant({ productId, ...values });

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

    console.log(
        "Variant Form Selected Attributes 2:",
        form.watch("selectedAttributes")
    );

    return (
        <form
            onSubmit={form.handleSubmit(
                onSubmit
            )}
            className="space-y-6"
        >
            <FormSection
                title="Basic Information testing 2"
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

                <VariantAttributes
                    form={form}
                    attributes={lookupData.attributes}
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