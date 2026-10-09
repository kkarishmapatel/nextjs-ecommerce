"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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

  const category =
    searchParams.get("category") ?? "";

  const brand =
    searchParams.get("brand") ?? "";

  const sort =
    searchParams.get("sort") ?? "newest";

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

    router.push(
      `${pathname}?${params.toString()}`
    );
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters =
    category ||
    brand ||
    sort !== "newest";

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Filters
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Refine products by category, brand, or price.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-gray-700"
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
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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

        <div>
          <label
            htmlFor="brand"
            className="mb-1.5 block text-sm font-medium text-gray-700"
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
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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

        <div>
          <label
            htmlFor="sort"
            className="mb-1.5 block text-sm font-medium text-gray-700"
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
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
      </div>
    </section>
  );
}