import { PrismaClient, Product, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProductInput = Partial<CreateProductInput>;

export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  try {
    return await prisma.product.create({ data });
  } catch (error) {
    console.error("Service: Error creating product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create product");
    }
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Service: Error fetching products:", error);
    throw new Error("Service Error: Failed to fetch products");
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    console.error("Service: Error fetching product by ID:", error);
    throw new Error("Service Error: Failed to fetch product by ID");
  }
};

export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Service: Error updating product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update product");
    }
  }
};

export const deleteProductPermanently = async (id: number): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("Service: Error deleting product permanently:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete product permanently");
    }
  }
};

export const archiveProduct = async (id: number): Promise<Product> => {
  try {
    return await prisma.product.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service: Error archiving product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive product");
    }
  }
};

export const unarchiveProduct = async (id: number): Promise<Product> => {
  try {
    return await prisma.product.update({
      where: { id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service: Error unarchiving product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to unarchive product");
    }
  }
};
