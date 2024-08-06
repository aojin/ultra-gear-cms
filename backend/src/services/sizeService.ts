import { PrismaClient, Size } from "@prisma/client";

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
  return await prisma.size.create({
    data: {
      size: data.size,
      quantity: data.quantity,
      productId: data.productId || null,
      variantId: data.variantId || null,
    },
  });
};

export const getAllSizes = async (): Promise<Size[]> => {
  return await prisma.size.findMany();
};

export const getSizesByProductId = async (
  productId: number
): Promise<Size[]> => {
  return await prisma.size.findMany({
    where: { productId },
  });
};

export const getSizesByVariantId = async (
  variantId: number
): Promise<Size[]> => {
  return await prisma.size.findMany({
    where: { variantId },
  });
};

export const getSizeById = async (id: number): Promise<Size | null> => {
  return await prisma.size.findUnique({
    where: { id },
  });
};

export const updateSize = async (
  id: number,
  data: UpdateSizeInput
): Promise<Size> => {
  return await prisma.size.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const archiveSize = async (id: number): Promise<Size> => {
  return await prisma.size.update({
    where: { id },
    data: { archived: true },
  });
};

export const unarchiveSize = async (id: number): Promise<Size> => {
  return await prisma.size.update({
    where: { id },
    data: { archived: false },
  });
};

export const deleteSize = async (id: number): Promise<void> => {
  await prisma.size.delete({
    where: { id },
  });
};
