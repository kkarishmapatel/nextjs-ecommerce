"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";


import {
  createAttributeValueSchema,
  type CreateAttributeValueInput,
} from "@/validators/attributeValue";


import {
  createAttributeValue,
} from "@/actions/attributeValue/createAttributeValue";


import {
  Label,
} from "@/components/ui/label";


import {
  Input,
} from "@/components/ui/input";


import FormActions from "@/components/common/forms/FormActions";
import { updateAttributeValue } from "@/actions/attributeValue/updateAttributeValue";


type AttributeValueData = {
  id: string;
  value: string;
};

type Props = {
  attributeId: string;
  initialData?: AttributeValueData;
};


export default function AttributeValueForm({
  attributeId,
  initialData,
}: Props) {

  const router = useRouter();


  const [loading, setLoading] =
    useState(false);


  const [message, setMessage] =
    useState("");

  const form = useForm<CreateAttributeValueInput>({
    resolver: zodResolver(createAttributeValueSchema),

    defaultValues: {
      value: initialData?.value ?? "",
    },
  });



  async function onSubmit(
    values: CreateAttributeValueInput
  ) {

    setLoading(true);

    setMessage("");



    const result = initialData
      ? await updateAttributeValue(
        initialData.id,
        values
      )
      : await createAttributeValue(
        attributeId,
        values
      );



    if (result.success) {

      router.push(
        `/admin/attributes/${attributeId}/values`
      );

      return;
    }



    if (result.errors) {

      Object.entries(
        result.errors
      ).forEach(
        ([field, errors]) => {

          if (!errors?.length)
            return;


          form.setError(
            field as keyof CreateAttributeValueInput,
            {
              type: "server",
              message: errors[0],
            }
          );

        }
      );

    }



    setMessage(
      "Failed to save value."
    );


    setLoading(false);
  }



  return (

    <form
      onSubmit={
        form.handleSubmit(onSubmit)
      }

      className="space-y-6"
    >

      <div>

        <Label>
          Value
        </Label>


        <Input

          placeholder="Black"

          {...form.register(
            "value"
          )}

        />


        <p className="text-sm text-red-600">

          {
            form.formState.errors.value
              ?.message
          }

        </p>

      </div>

      <FormActions
        loading={loading}
        submitLabel={
          initialData
            ? "Update Value"
            : "Save Value"
        }
      />


      {
        message && (

          <p className="text-red-600">
            {message}
          </p>

        )
      }


    </form>

  );
}