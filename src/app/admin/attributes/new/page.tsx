import PageHeader from "@/components/common/layout/PageHeader";

import AttributeForm from "@/components/admin/attributes/AttributeForm";

export default function NewAttributePage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <PageHeader
        title="Create Attribute"
        description="Create a new product attribute."
      />

      <AttributeForm />
    </div>
  );
}