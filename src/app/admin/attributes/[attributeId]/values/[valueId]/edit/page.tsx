import { prisma } from "@/lib/prisma";

import AttributeValueForm from "@/components/admin/attribute-values/AttributeValueForm";

type Props = {
  params: Promise<{
    attributeId: string;
    valueId: string;
  }>;
};

export default async function EditAttributeValuePage({
  params,
}: Props) {
  const {
    attributeId,
    valueId,
  } = await params;

  const value =
    await prisma.attributeValue.findUnique({
      where: {
        id: valueId,
      },
    });

  if (!value) {
    return (
      <div className="p-8">
        Attribute value not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Edit Attribute Value
      </h1>

      <AttributeValueForm
        attributeId={attributeId}
        initialData={{
          id: value.id,
          value: value.value,
        }}
      />
    </div>
  );
}