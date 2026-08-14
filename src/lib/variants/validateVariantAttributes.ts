import { prisma } from "@/lib/prisma";

type SelectedAttribute = {
  attributeId: string;
  attributeValueId: string;
};

type ValidationResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function validateVariantAttributes(
  selectedAttributes: SelectedAttribute[]
): Promise<ValidationResult> {
  // No attributes selected is valid.
  if (selectedAttributes.length === 0) {
    return {
      success: true,
    };
  }

  // --------------------------------------------------
  // 1. Prevent duplicate attributes
  // --------------------------------------------------

  const attributeIds =
    selectedAttributes.map(
      (item) => item.attributeId
    );

  if (
    new Set(attributeIds).size !==
    attributeIds.length
  ) {
    return {
      success: false,
      error:
        "A variant can only have one value per attribute.",
    };
  }

  // --------------------------------------------------
  // 2. Prevent duplicate attribute values
  // --------------------------------------------------

  const attributeValueIds =
    selectedAttributes.map(
      (item) => item.attributeValueId
    );

  if (
    new Set(attributeValueIds).size !==
    attributeValueIds.length
  ) {
    return {
      success: false,
      error:
        "Duplicate attribute values are not allowed.",
    };
  }

  // --------------------------------------------------
  // 3. Fetch the submitted AttributeValue records
  // --------------------------------------------------

  const attributeValues =
    await prisma.attributeValue.findMany({
      where: {
        id: {
          in: attributeValueIds,
        },
      },
      select: {
        id: true,
        attributeId: true,
        value: true,
        isActive: true,
      },
    });

  // --------------------------------------------------
  // 4. Make sure every value exists
  // --------------------------------------------------

  if (
    attributeValues.length !==
    attributeValueIds.length
  ) {
    return {
      success: false,
      error:
        "One or more selected attribute values do not exist.",
    };
  }

  // --------------------------------------------------
  // 5. Validate attribute/value relationship
  // --------------------------------------------------

  const attributeValueMap =
    new Map(
      attributeValues.map((item) => [
        item.id,
        item,
      ])
    );

  for (const selected of selectedAttributes) {
    const attributeValue =
      attributeValueMap.get(
        selected.attributeValueId
      );

    if (!attributeValue) {
      return {
        success: false,
        error:
          "One or more selected attribute values do not exist.",
      };
    }

    if (
      attributeValue.attributeId !==
      selected.attributeId
    ) {
      return {
        success: false,
        error:
          "An attribute value does not belong to the selected attribute.",
      };
    }

    // --------------------------------------------------
    // 6. Prevent inactive attribute values
    // --------------------------------------------------

    if (!attributeValue.isActive) {
      return {
        success: false,
        error:
          "Inactive attribute values cannot be assigned to a variant.",
      };
    }
  }

  return {
    success: true,
  };
}