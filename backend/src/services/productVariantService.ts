import { PrismaClient, ProductVariant } from "@prisma/client";

const prisma = new PrismaClient();

// Define the type for creating a new product variant, omitting fields that are automatically generated
type CreateProductVariantInput = Omit<
  ProductVariant,
  "id" | "createdAt" | "updatedAt"
>;

export const createProductVariant = async (
  data: CreateProductVariantInput
): Promise<ProductVariant> => {
  return await prisma.productVariant.create({ data });
};

export const getAllProductVariants = async (): Promise<ProductVariant[]> => {
  return await prisma.productVariant.findMany();
};

export const getProductVariantById = async (
  id: number
): Promise<ProductVariant | null> => {
  return await prisma.productVariant.findUnique({
    where: { id: id },
  });
};

export const updateProductVariant = async (
  id: number,
  data: Partial<ProductVariant>
): Promise<ProductVariant> => {
  return await prisma.productVariant.update({
    where: { id: id },
    data,
  });
};

export const deleteProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  return await prisma.productVariant.delete({
    where: { id: id },
  });
};

export const archiveProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  return await prisma.productVariant.update({
    where: { id: id },
    data: { archived: true },
  });
};

export const unarchiveProductVariant = async (
  id: number
): Promise<ProductVariant> => {
  return await prisma.productVariant.update({
    where: { id: id },
    data: { archived: false },
  });
};
