import AttributeValueForm from "@/components/admin/attribute-values/AttributeValueForm";


type Props = {
  params: Promise<{
    attributeId: string;
  }>;
};


export default async function NewAttributeValuePage({
  params,
}: Props) {

  const {
    attributeId,
  } = await params;


  return (

    <div className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Add Attribute Value
      </h1>


      <AttributeValueForm
        attributeId={attributeId}
      />

    </div>

  );
}