import Image from "next/image";

type VariantImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type VariantImageGalleryProps = {
  images: VariantImage[];
};

export function VariantImageGallery({
  images,
}: VariantImageGalleryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium">
        Images
      </h2>

      {images.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No images added.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={
                    image.altText ||
                    "Variant image"
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className="p-2 text-xs">
                <p>
                  {image.sortOrder === 0
                    ? "Primary image"
                    : `Image ${image.sortOrder + 1}`}
                </p>

                {image.altText && (
                  <p className="mt-1 truncate text-muted-foreground">
                    {image.altText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}