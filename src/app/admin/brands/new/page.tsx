import BrandForm from "@/components/admin/brands/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Create Brand
      </h1>

      <BrandForm />
    </div>
  );
}