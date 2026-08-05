import Link from "next/link";

import { prisma } from "@/lib/prisma";

import AttributeValueTable from "@/components/admin/attribute-values/AttributeValueTable";

import { getAttributeValues } from "@/actions/attributeValue/getAttributeValues";


type Props = {
  params: Promise<{
    attributeId: string;
  }>;
};


export default async function AttributeValuesPage({
  params,
}: Props) {

  const {
    attributeId,
  } = await params;


  const attribute =
    await prisma.attribute.findUnique({
      where: {
        id: attributeId,
      },
    });


  if (!attribute) {
    return (
      <div>
        Attribute not found.
      </div>
    );
  }


  const values =
    await getAttributeValues(
      attributeId
    );


  return (

    <div className="mx-auto max-w-5xl p-8">

      <div className="mb-6 flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold">
            {attribute.name}
          </h1>


          <p className="text-gray-500">
            Manage attribute values
          </p>

        </div>



        <Link

          href={`/admin/attributes/${attributeId}/values/new`}

          className="rounded bg-black px-4 py-2 text-white"

        >

          Add Value

        </Link>


      </div>



      <AttributeValueTable

        attributeId={attributeId}

        values={values}

      />


    </div>

  );
}