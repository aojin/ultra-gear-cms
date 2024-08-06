import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<Category> => {
  return await prisma.category.create({
    data,
  });
};

export const getAllCategories = async (): Promise<Category[]> => {
  return await prisma.category.findMany();
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategory = async (
  id: number,
  data: { name: string; description?: string }
): Promise<Category> => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: number): Promise<Category> => {
  return await prisma.category.delete({
    where: { id },
  });
};
