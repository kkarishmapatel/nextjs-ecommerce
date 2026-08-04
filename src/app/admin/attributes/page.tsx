import Link from "next/link";

import { prisma } from "@/lib/prisma";

import PageHeader from "@/components/common/layout/PageHeader";

import AttributeTable from "@/components/admin/attributes/AttributeTable";

export default async function AttributesPage() {
  const attributes =
    await prisma.attribute.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Attributes"
          description="Manage product attributes."
        />

        <Link
          href="/admin/attributes/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Attribute
        </Link>
      </div>

      <AttributeTable
        attributes={attributes}
      />
    </div>
  );
}