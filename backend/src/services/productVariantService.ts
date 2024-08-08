import { PrismaClient, ProductVariant, Prisma } from "@prisma/client";
import { CreateProductVariantInput, UpdateProductVariantInput } from "../types";

const prisma = new PrismaClient();

export const createProductVariant = async (
  data: CreateProductVariantInput
): Promise<ProductVariant> => {
  const { isSingleSize, quantity, ...variantData } = data;

  const variant = await prisma.productVariant.create({
    data: {
      ...variantData,
      quantity: isSingleSize ? quantity || 0 : 0,
    },
  });

  await updateProductTotalQuantity(data.productId);

  return variant;
};

export const updateProductTotalQuantity = async (productId: number) => {
  const totalQuantity = await getProductTotalQuantity(productId);

  await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: totalQuantity,
    },
  });
};

const getProductTotalQuantity = async (productId: number) => {
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
  data: UpdateProductVariantInput
): Promise<ProductVariant> => {
  try {
    const variant = await prisma.productVariant.update({
      where: { id },
      data,
    });

    // Update the product total quantity after the variant is updated
    await updateProductTotalQuantity(variant.productId);

    return variant;
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
    const variant = await prisma.productVariant.delete({
      where: { id },
    });

    // Update the product total quantity after the variant is deleted
    await updateProductTotalQuantity(variant.productId);

    return variant;
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
    const variant = await prisma.productVariant.update({
      where: { id },
      data: { archived: true },
    });

    // Update the product total quantity after the variant is archived
    await updateProductTotalQuantity(variant.productId);

    return variant;
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
    const variant = await prisma.productVariant.update({
      where: { id },
      data: { archived: false },
    });

    // Update the product total quantity after the variant is unarchived
    await updateProductTotalQuantity(variant.productId);

    return variant;
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
