import { PrismaClient, Product, Prisma } from "@prisma/client";
import { CreateProductInput, UpdateProductInput } from "../types";
import { createProductVariant } from "./productVariantService";

const prisma = new PrismaClient();

/**
 * Creates a new product.
 * @param data - The product data.
 * @returns The created product.
 */
export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  const { isSingleSize, quantity, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      quantity: isSingleSize ? quantity || 0 : 0,
    },
  });

  return product;
};

export const getProductTotalQuantity = async (productId: number) => {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    include: { sizes: true },
  });

  return variants.reduce((total, variant) => {
    if (variant.isSingleSize) {
      return total + (variant.quantity || 0);
    } else {
      return (
        total +
        variant.sizes.reduce(
          (variantTotal, size) => variantTotal + (size.quantity || 0),
          0
        )
      );
    }
  }, 0);
};

/**
 * Retrieves all products.
 * @returns An array of all products.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Service: Error fetching products:", error);
    throw new Error("Service Error: Failed to fetch products");
  }
};

/**
 * Retrieves a product by its ID.
 * @param id - The ID of the product.
 * @returns The product, or null if not found.
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    console.error("Service: Error fetching product by ID:", error);
    throw new Error("Service Error: Failed to fetch product by ID");
  }
};

/**
 * Updates a product by its ID.
 * @param id - The ID of the product.
 * @param data - The product data to update.
 * @returns The updated product.
 */
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

/**
 * Permanently deletes a product by its ID.
 * @param id - The ID of the product.
 */
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

/**
 * Archives a product by its ID.
 * @param id - The ID of the product.
 * @returns The archived product.
 */
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

/**
 * Unarchives a product by its ID.
 * @param id - The ID of the product.
 * @returns The unarchived product.
 */
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
