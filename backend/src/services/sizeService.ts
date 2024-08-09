import { PrismaClient, Size, Prisma } from "@prisma/client";
import { CreateSizeInput } from "../types";
import { updateProductTotalQuantity } from "./productVariantService"; // Import the function from the variant service
import { UpdateSizeInput } from "../types";

const prisma = new PrismaClient();

export const createSize = async (data: CreateSizeInput) => {
  console.log({ data });
  // Validate product and variant existence
  if (data.variantId) {
    const variantExists = await prisma.productVariant.findUnique({
      where: { id: data.variantId },
    });
    if (!variantExists) {
      throw new Error(`Variant with ID ${data.variantId} does not exist.`);
    }
  }

  if (data.productId) {
    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!productExists) {
      throw new Error(`Product with ID ${data.productId} does not exist.`);
    }
  }

  const newSize = await prisma.size.create({
    data: {
      ...data,
      quantity: data.quantity || 0, // Initialize size quantity
    },
  });

  if (data.variantId) {
    // Update variant quantity to be the sum of all size quantities
    await updateVariantTotalQuantity(data.variantId);
  }

  return newSize;
};

const updateVariantTotalQuantity = async (variantId: number) => {
  const totalQuantity = await getVariantTotalQuantity(variantId);

  await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      quantity: totalQuantity,
    },
  });

  // Get the productId related to the variant
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (variant) {
    // Update product quantity as well
    await updateProductTotalQuantity(variant.productId);
  }
};

const getVariantTotalQuantity = async (variantId: number) => {
  const sizes = await prisma.size.findMany({
    where: { variantId },
  });

  return sizes.reduce((total, size) => total + (size.quantity || 0), 0);
};

export const getAllSizes = async (): Promise<Size[]> => {
  try {
    return await prisma.size.findMany();
  } catch (error) {
    console.error("Service Error: Fetching all sizes:", error);
    throw new Error("Service Error: Failed to fetch all sizes");
  }
};

export const getSizesByProductId = async (
  productId: number
): Promise<Size[]> => {
  try {
    return await prisma.size.findMany({
      where: { productId },
    });
  } catch (error) {
    console.error("Service Error: Fetching sizes by product ID:", error);
    throw new Error("Service Error: Failed to fetch sizes by product ID");
  }
};

export const getSizesByVariantId = async (
  variantId: number
): Promise<Size[]> => {
  try {
    return await prisma.size.findMany({
      where: { variantId },
    });
  } catch (error) {
    console.error("Service Error: Fetching sizes by variant ID:", error);
    throw new Error("Service Error: Failed to fetch sizes by variant ID");
  }
};

export const getSizeById = async (id: number): Promise<Size | null> => {
  try {
    return await prisma.size.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Fetching size by ID:", error);
    throw new Error("Service Error: Failed to fetch size by ID");
  }
};

export const updateSize = async (
  id: number,
  data: UpdateSizeInput
): Promise<Size> => {
  try {
    const sizeExists = await prisma.size.findUnique({ where: { id } });
    if (!sizeExists) {
      throw new Error(`Size with ID ${id} does not exist.`);
    }

    const updatedSize = await prisma.size.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    if (updatedSize.variantId) {
      await updateVariantTotalQuantity(updatedSize.variantId);
    }

    return updatedSize;
  } catch (error) {
    console.error("Service Error: Updating size:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to update size");
    }
  }
};

export const archiveSize = async (id: number): Promise<Size> => {
  try {
    return await prisma.size.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service Error: Archiving size:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to archive size");
    }
  }
};

export const unarchiveSize = async (id: number): Promise<Size> => {
  try {
    return await prisma.size.update({
      where: { id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service Error: Unarchiving size:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to unarchive size");
    }
  }
};

export const deleteSize = async (id: number): Promise<void> => {
  try {
    await prisma.size.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Deleting size:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to delete size");
    }
  }
};
