import { PrismaClient, Size, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateSizeInput = {
  size: string;
  quantity: number;
  productId?: number | null;
  variantId?: number | null;
};

export type UpdateSizeInput = {
  size?: string;
  quantity?: number;
};

export const createSize = async (data: CreateSizeInput): Promise<Size> => {
  try {
    return await prisma.size.create({
      data: {
        size: data.size,
        quantity: data.quantity,
        productId: data.productId || null,
        variantId: data.variantId || null,
      },
    });
  } catch (error) {
    console.error("Service Error: Creating size:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to create size");
    }
  }
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
    return await prisma.size.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
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
