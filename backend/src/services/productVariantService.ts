import { PrismaClient, ProductVariant, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Define the type for creating a new product variant, omitting fields that are automatically generated
type CreateProductVariantInput = Omit<
  ProductVariant,
  "id" | "createdAt" | "updatedAt"
>;

export const createProductVariant = async (
  data: CreateProductVariantInput
): Promise<ProductVariant> => {
  try {
    return await prisma.productVariant.create({ data });
  } catch (error) {
    console.error("Service: Error creating product variant:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create product variant");
    }
  }
};

export const getAllProductVariants = async (): Promise<ProductVariant[]> => {
  try {
    return await prisma.productVariant.findMany();
  } catch (error) {
    console.error("Service: Error fetching product variants:", error);
    throw new Error("Service Error: Failed to fetch product variants");
  }
};

export const getProductVariantById = async (
  id: number
): Promise<ProductVariant | null> => {
  try {
    return await prisma.productVariant.findUnique({
      where: { id: id },
    });
  } catch (error) {
    console.error("Service: Error fetching product variant by ID:", error);
    throw new Error("Service Error: Failed to fetch product variant by ID");
  }
};

export const updateProductVariant = async (
  id: number,
  data: Partial<ProductVariant>
): Promise<ProductVariant> => {
  try {
    return await prisma.productVariant.update({
      where: { id: id },
      data,
    });
  } catch (error) {
    console.error("Service: Error updating product variant:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update product variant");
    }
  }
};

export const deleteProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  try {
    return await prisma.productVariant.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error("Service: Error deleting product variant:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete product variant");
    }
  }
};

export const archiveProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  try {
    return await prisma.productVariant.update({
      where: { id: id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service: Error archiving product variant:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive product variant");
    }
  }
};

export const unarchiveProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  try {
    return await prisma.productVariant.update({
      where: { id: id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service: Error unarchiving product variant:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to unarchive product variant");
    }
  }
};
