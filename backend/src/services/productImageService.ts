import { PrismaClient, ProductImage } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateProductImageInput = Omit<
  ProductImage,
  "id" | "createdAt" | "updatedAt" | "archived"
>;

export type UpdateProductImageInput = Partial<CreateProductImageInput>;

export const createProductImage = async (
  data: CreateProductImageInput
): Promise<ProductImage> => {
  return await prisma.productImage.create({ data });
};

export const getAllProductImages = async (): Promise<ProductImage[]> => {
  return await prisma.productImage.findMany();
};

export const getProductImageById = async (
  id: number
): Promise<ProductImage | null> => {
  return await prisma.productImage.findUnique({ where: { id } });
};

export const getAllProductImagesByProductId = async (
  productId: number
): Promise<ProductImage[]> => {
  return await prisma.productImage.findMany({ where: { productId } });
};

export const getAllProductVariantImagesByVariantId = async (
  variantId: number
): Promise<ProductImage[]> => {
  return await prisma.productImage.findMany({
    where: { productVariantId: variantId },
  });
};

export const updateProductImage = async (
  id: number,
  data: UpdateProductImageInput
): Promise<ProductImage> => {
  return await prisma.productImage.update({
    where: { id },
    data,
  });
};

export const archiveProductImage = async (
  id: number
): Promise<ProductImage> => {
  return await prisma.productImage.update({
    where: { id },
    data: { archived: true },
  });
};

export const unarchiveProductImage = async (
  id: number
): Promise<ProductImage> => {
  return await prisma.productImage.update({
    where: { id },
    data: { archived: false },
  });
};

export const deleteProductImage = async (id: number): Promise<void> => {
  await prisma.productImage.delete({ where: { id } });
};
