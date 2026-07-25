"use server";

import { prisma } from "@/lib/prisma";
import {
    createCategorySchema,
    type CreateCategoryInput,
} from "@/validators/category";

export async function createCategory(input: CreateCategoryInput) {
    const validatedFields = createCategorySchema.safeParse(input);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {
        name,
        slug,
        description,
        sortOrder,
        parentId,
    } = validatedFields.data;

    const existingSlug = await prisma.category.findFirst({
        where: {
            slug,
        },
    });

    if (existingSlug) {
        return {
            success: false,
            errors: {
                slug: ["Slug already exists."],
            },
        };
    }

    const existingCategory = await prisma.category.findFirst({
        where: {
            parentId: parentId || null,
            name,
            isDeleted: false,
        },
    });

    if (existingCategory) {
        return {
            success: false,
            errors: {
                name: [
                    "A category with this name already exists under the selected parent.",
                ],
            },
        };
    }

    const category = await prisma.category.create({
        data: {
            name,
            slug,
            description: description || null,
            sortOrder,
            parentId: parentId || null,
        },
    });

    return {
        success: true,
        categoryId: category.id,
    };
}