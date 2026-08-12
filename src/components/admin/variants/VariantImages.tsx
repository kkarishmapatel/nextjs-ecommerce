"use client";

import { useEffect, useState } from "react";
// lucide-react icons imported below in a grouped import

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getVariantImages } from "@/actions/productImage/getVariantImages";
import { createProductImage } from "@/actions/productImage/createProductImage";
import { deleteProductImage } from "@/actions/productImage/deleteProductImage";

import type { ProductImageItem } from "@/types/productImage";
import {
    ChevronDown,
    ChevronUp,
    Trash2,
} from "lucide-react";
import { reorderProductImages } from "@/actions/productImage/reorderProductImages";
import { setPrimaryProductImage } from "@/actions/productImage/setPrimaryProductImage";
type Props = {
    variantId: string;
};


export default function VariantImages({
    variantId,
}: Props) {
    const [images, setImages] =
        useState<ProductImageItem[]>([]);

    const [url, setUrl] = useState("");
    const [altText, setAltText] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    async function loadImages() {
        const result =
            await getVariantImages(variantId);

        setImages(result);
    }

    async function moveImage(
        imageId: string,
        direction: "up" | "down"
    ) {
        const currentIndex = images.findIndex(
            (image) => image.id === imageId
        );

        if (currentIndex === -1) {
            return;
        }

        const newIndex =
            direction === "up"
                ? currentIndex - 1
                : currentIndex + 1;

        if (
            newIndex < 0 ||
            newIndex >= images.length
        ) {
            return;
        }

        const reordered = [...images];

        const [movedImage] = reordered.splice(
            currentIndex,
            1
        );

        reordered.splice(
            newIndex,
            0,
            movedImage
        );

        const payload = reordered.map(
            (image, index) => ({
                id: image.id,
                sortOrder: index,
            })
        );

        setImages(
            reordered.map((image, index) => ({
                ...image,
                sortOrder: index,
            }))
        );

        setLoading(true);
        setMessage("");

        const result =
            await reorderProductImages(
                variantId,
                payload
            );

        if (!result.success) {
            setMessage(
                "Failed to reorder images."
            );

            await loadImages();
        }

        setLoading(false);
    }
    async function handleSetPrimary(
        imageId: string
    ) {
        if (images[0]?.id === imageId) {
            return;
        }

        setLoading(true);
        setMessage("");

        const result =
            await setPrimaryProductImage(
                variantId,
                imageId
            );

        if (!result.success) {
            setMessage(
                result.error ??
                "Failed to set primary image."
            );

            setLoading(false);
            return;
        }

        await loadImages();

        setLoading(false);
    }
    useEffect(() => {
        loadImages();
    }, [variantId]);

    async function handleAddImage() {
        if (!url.trim()) {
            setMessage("Image URL is required.");
            return;
        }

        setLoading(true);
        setMessage("");

        const result =
            await createProductImage({
                variantId,
                url,
                altText,
                sortOrder: images.length,
            });

        if (!result.success) {
            setMessage(
                result.errors?.url?.[0] ??
                "Failed to add image."
            );

            setLoading(false);
            return;
        }

        setUrl("");
        setAltText("");

        await loadImages();

        setLoading(false);
    }

    async function handleDelete(
        imageId: string
    ) {
        setLoading(true);
        setMessage("");

        const result =
            await deleteProductImage(imageId);

        if (!result.success) {
            setMessage(
                "Failed to delete image."
            );

            setLoading(false);
            return;
        }

        await loadImages();

        setLoading(false);
    }

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">
                    Images
                </h2>

                <p className="text-sm text-muted-foreground">
                    Add and manage images for this variant.
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="space-y-2 rounded-lg border p-3"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                                <img
                                    src={image.url}
                                    alt={image.altText ?? ""}
                                    className="block h-full w-full object-cover"
                                />
                            </div>


                            <p className="truncate text-xs text-muted-foreground">
                                {image.url}
                            </p>
                            {image.sortOrder === 0 ? (
                                <span className="inline-flex rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                    Primary
                                </span>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    onClick={() =>
                                        handleSetPrimary(image.id)
                                    }
                                >
                                    Set Primary
                                </Button>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        loading ||
                                        images.indexOf(image) === 0
                                    }
                                    onClick={() =>
                                        moveImage(image.id, "up")
                                    }
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        loading ||
                                        images.indexOf(image) ===
                                        images.length - 1
                                    }
                                    onClick={() =>
                                        moveImage(image.id, "down")
                                    }
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                disabled={loading}
                                onClick={() =>
                                    handleDelete(image.id)
                                }
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                    <Label htmlFor="variant-image-url">
                        Image URL
                    </Label>

                    <Input
                        id="variant-image-url"
                        value={url}
                        onChange={(event) =>
                            setUrl(event.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="variant-image-alt">
                        Alt Text
                    </Label>

                    <Input
                        id="variant-image-alt"
                        value={altText}
                        onChange={(event) =>
                            setAltText(event.target.value)
                        }
                        placeholder="Product image"
                    />
                </div>

                <Button
                    type="button"
                    disabled={loading}
                    onClick={handleAddImage}
                >
                    {loading
                        ? "Saving..."
                        : "Add Image"}
                </Button>
            </div>

            {message && (
                <p className="text-sm text-red-600">
                    {message}
                </p>
            )}
        </section>
    );
}