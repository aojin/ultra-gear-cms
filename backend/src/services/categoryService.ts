import { PrismaClient, Category, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<Category> => {
  if (data.name.startsWith("Uncategorized")) {
    throw new Error("Cannot create a category with the name 'Uncategorized'");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw new Error(`Category with the name '${data.name}' already exists`);
  }

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
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.name.startsWith("Uncategorized")) {
    throw new Error("Cannot update the Uncategorized category");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory && existingCategory.id !== id) {
    throw new Error(`Category with the name '${data.name}' already exists`);
  }

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

export const deleteCategory = async (categoryId: number): Promise<void> => {
  let uncategorizedCategory = await prisma.category.findFirst({
    where: { name: { startsWith: "Uncategorized" } },
  });

  if (!uncategorizedCategory) {
    uncategorizedCategory = await prisma.category.create({
      data: {
        name: "Uncategorized",
        description: "Default category for uncategorized products",
      },
    });
  }

  if (categoryId === uncategorizedCategory.id) {
    throw new Error("Cannot delete the Uncategorized category");
  }

  const products = await prisma.product.findMany({
    where: { categories: { some: { id: categoryId } } },
  });

  // Update each product to set them to the 'Uncategorized' category
  await prisma.$transaction(
    products.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: {
          categories: {
            set: [{ id: uncategorizedCategory!.id }],
          },
        },
      })
    )
  );

  // Delete the category
  await prisma.category.delete({
    where: { id: categoryId },
  });
};
