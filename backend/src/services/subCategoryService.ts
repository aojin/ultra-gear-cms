import { Prisma, PrismaClient, SubCategory } from "@prisma/client";

const prisma = new PrismaClient();

export const createSubCategory = async (
  name: string,
  description: string,
  categoryId: number
): Promise<SubCategory> => {
  try {
    return await prisma.subCategory.create({
      data: {
        name,
        description,
        categoryId,
      },
    });
  } catch (error) {
    console.error("Service Error: Creating subcategory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to create size");
    }
  }
};

export const getAllSubCategories = async (): Promise<SubCategory[]> => {
  try {
    return await prisma.subCategory.findMany();
  } catch (error) {
    console.error("Service Error: Fetching all subcategories:", error);
    throw new Error("Service Error: Failed to fetch all subcategories");
  }
};

export const getSubCategoryById = async (
  id: number
): Promise<SubCategory | null> => {
  try {
    return await prisma.subCategory.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Fetching subcategory by ID:", error);
    throw new Error("Service Error: Failed to fetch subcategory by ID");
  }
};

export const updateSubCategory = async (
  id: number,
  name: string,
  description: string,
  categoryId: number
): Promise<SubCategory> => {
  try {
    return await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
      },
    });
  } catch (error) {
    console.error("Service Error: Updating subcategory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to update subcategory");
    }
  }
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
      try {
        await tx.product.update({
          where: { id: product.id },
          data: {
            subcategories: {
              disconnect: { id: subCategory.id },
            },
          },
        });
      } catch (error) {
        console.error(
          "Service Error: Deleting disconnecting subcategory from category to delete:",
          error
        );
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error("Service Error: Known request error occurred");
        } else {
          throw new Error(
            "Service Error: Failed to disconnect subcategory from category to delete"
          );
        }
      }
    }

    try {
      await tx.subCategory.delete({
        where: { id: subCategory.id },
      });
    } catch (error) {
      console.error("Service Error: Deleting subcategory:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error("Service Error: Known request error occurred");
      } else {
        throw new Error("Service Error: Failed to delete subcategory");
      }
    }
  });
};
