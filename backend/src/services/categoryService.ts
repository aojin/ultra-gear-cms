import { PrismaClient, Category, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<Category> => {
  try {
    return await prisma.category.create({
      data,
    });
  } catch (error: any) {
    console.error("Service: Error creating category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create category");
    }
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    return await prisma.category.findMany();
  } catch (error: any) {
    console.error("Service: Error fetching categories:", error);
    throw new Error("Service Error: Failed to fetch categories");
  }
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    return await prisma.category.findUnique({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error fetching category by ID:", error);
    throw new Error("Service Error: Failed to fetch category by ID");
  }
};

export const updateCategory = async (
  id: number,
  data: { name: string; description?: string }
): Promise<Category> => {
  try {
    return await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    console.error("Service: Error updating category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update category");
    }
  }
};

export const deleteCategory = async (id: number): Promise<Category> => {
  try {
    return await prisma.category.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error deleting category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete category");
    }
  }
};
