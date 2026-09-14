"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ShopFiltersProps = {
  categories: {
    name: string;
    slug: string;
  }[];

  brands: {
    name: string;
    slug: string;
  }[];
};

export default function ShopFilters({
  categories,
  brands,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  function updateFilter(
    key: string,
    value: string
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end">
      <div className="flex-1">
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium"
        >
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) =>
            updateFilter(
              "category",
              event.target.value
            )
          }
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((item) => (
            <option
              key={item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="brand"
          className="mb-1 block text-sm font-medium"
        >
          Brand
        </label>

        <select
          id="brand"
          value={brand}
          onChange={(event) =>
            updateFilter(
              "brand",
              event.target.value
            )
          }
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">
            All Brands
          </option>

          {brands.map((item) => (
            <option
              key={item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="sort"
          className="mb-1 block text-sm font-medium"
        >
          Sort By
        </label>

        <select
          id="sort"
          value={sort}
          onChange={(event) =>
            updateFilter(
              "sort",
              event.target.value
            )
          }
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="newest">
            Newest
          </option>

          <option value="price-asc">
            Price: Low to High
          </option>

          <option value="price-desc">
            Price: High to Low
          </option>

          <option value="name-asc">
            Name: A to Z
          </option>
        </select>
      </div>

      {(category || brand || sort !== "newest") && (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Clear
        </button>
      )}
    </div>
  );
}