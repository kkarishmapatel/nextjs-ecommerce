import { prisma } from "@/lib/prisma";

import CategoryForm from "@/components/admin/categories/CategoryForm";


export default async function NewCategoryPage() {

  const parentCategories =
    await prisma.category.findMany({
      where:{
        isDeleted:false,
      },
      select:{
        id:true,
        name:true,
      },
      orderBy:{
        name:"asc",
      },
    });


  return (
    <div className="mx-auto max-w-2xl space-y-6">

      <h1 className="text-2xl font-bold">
        Create Category
      </h1>


      <CategoryForm
        parentCategories={
          parentCategories
        }
      />

    </div>
  );
}