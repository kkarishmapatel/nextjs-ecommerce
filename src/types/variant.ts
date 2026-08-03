export type VariantListItem = {
  id: string;

  sku: string;

  price: number;

  compareAtPrice: number | null;

  stock: number;

  isDefault: boolean;

  isActive: boolean;

  createdAt: Date;

  attributes: {
    attribute: string;
    value: string;
  }[];
};

export type VariantLookupData = {};