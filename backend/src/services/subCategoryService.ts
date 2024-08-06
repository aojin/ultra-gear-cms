import { PrismaClient, SubCategory } from "@prisma/client";

const prisma = new PrismaClient();

export const createSubCategory = async (
  name: string,
  description: string,
  categoryId: number
): Promise<SubCategory> => {
  return await prisma.subCategory.create({
    data: {
      name,
      description,
      categoryId,
    },
  });
};

export const getAllSubCategories = async (): Promise<SubCategory[]> => {
  return await prisma.subCategory.findMany();
};

export const getSubCategoryById = async (
  id: number
): Promise<SubCategory | null> => {
  return await prisma.subCategory.findUnique({
    where: { id },
  });
};

export const updateSubCategory = async (
  id: number,
  name: string,
  description: string,
  categoryId: number
): Promise<SubCategory> => {
  return await prisma.subCategory.update({
    where: { id },
    data: {
      name,
      description,
      categoryId,
    },
  });
};

export const deleteSubCategory = async (id: number): Promise<void> => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!subCategory) {
    throw new Error("SubCategory not found");
  }

  await prisma.$transaction(async (tx) => {
    for (const product of subCategory.products) {
      await tx.product.update({
        where: { id: product.id },
        data: {
          subcategories: {
            disconnect: { id: subCategory.id },
          },
        },
      });
    }

    await tx.subCategory.delete({
      where: { id: subCategory.id },
    });
  });
};
