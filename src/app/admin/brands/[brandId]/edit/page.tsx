import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import BrandEditForm from "@/components/admin/brands/BrandEditForm";

type Props = {
  params: Promise<{
    brandId: string;
  }>;
};

export default async function EditBrandPage({
  params,
}: Props) {
  const { brandId } = await params;

  const brand =
    await prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

  if (!brand) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Brand
      </h1>

      <BrandEditForm brand={brand} />
    </div>
  );
}