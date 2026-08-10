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


export type VariantAttributeLookup = {
  id: string;
  name: string;

  values: {
    id: string;
    name: string;
  }[];
};

export type VariantLookupData = {
  attributes: VariantAttributeLookup[];

  // keep the other lookup collections
};