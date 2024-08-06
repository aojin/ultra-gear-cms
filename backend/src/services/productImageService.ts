import { PrismaClient, ProductImage, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateProductImageInput = Omit<
  ProductImage,
  "id" | "createdAt" | "updatedAt" | "archived"
>;

export type UpdateProductImageInput = Partial<CreateProductImageInput>;

export const createProductImage = async (
  data: CreateProductImageInput
): Promise<ProductImage> => {
  try {
    return await prisma.productImage.create({ data });
  } catch (error) {
    console.error("Service: Error creating product image:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create product image");
    }
  }
};

export const getAllProductImages = async (): Promise<ProductImage[]> => {
  try {
    return await prisma.productImage.findMany();
  } catch (error) {
    console.error("Service: Error fetching product images:", error);
    throw new Error("Service Error: Failed to fetch product images");
  }
};

export const getProductImageById = async (
  id: number
): Promise<ProductImage | null> => {
  try {
    return await prisma.productImage.findUnique({ where: { id } });
  } catch (error) {
    console.error("Service: Error fetching product image by ID:", error);
    throw new Error("Service Error: Failed to fetch product image by ID");
  }
};

export const getAllProductImagesByProductId = async (
  productId: number
): Promise<ProductImage[]> => {
  try {
    return await prisma.productImage.findMany({ where: { productId } });
  } catch (error) {
    console.error(
      "Service: Error fetching product images by product ID:",
      error
    );
    throw new Error(
      "Service Error: Failed to fetch product images by product ID"
    );
  }
};

export const getAllProductVariantImagesByVariantId = async (
  variantId: number
): Promise<ProductImage[]> => {
  try {
    return await prisma.productImage.findMany({
      where: { productVariantId: variantId },
    });
  } catch (error) {
    console.error(
      "Service: Error fetching product images by variant ID:",
      error
    );
    throw new Error(
      "Service Error: Failed to fetch product images by variant ID"
    );
  }
};

export const updateProductImage = async (
  id: number,
  data: UpdateProductImageInput
): Promise<ProductImage> => {
  try {
    return await prisma.productImage.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Service: Error updating product image:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update product image");
    }
  }
};

export const archiveProductImage = async (
  id: number
): Promise<ProductImage> => {
  try {
    return await prisma.productImage.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service: Error archiving product image:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive product image");
    }
  }
};

export const unarchiveProductImage = async (
  id: number
): Promise<ProductImage> => {
  try {
    return await prisma.productImage.update({
      where: { id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service: Error unarchiving product image:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to unarchive product image");
    }
  }
};

export const deleteProductImage = async (id: number): Promise<void> => {
  try {
    await prisma.productImage.delete({ where: { id } });
  } catch (error) {
    console.error("Service: Error deleting product image:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete product image");
    }
  }
};
