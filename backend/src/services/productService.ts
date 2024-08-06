import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProductInput = Partial<CreateProductInput>;

export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  return await prisma.product.create({ data });
};

export const getAllProducts = async (): Promise<Product[]> => {
  return await prisma.product.findMany();
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return await prisma.product.findUnique({ where: { id } });
};

export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProductPermanently = async (id: number): Promise<void> => {
  await prisma.product.delete({ where: { id } });
};

export const archiveProduct = async (id: number): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data: { archived: true },
  });
};

export const unarchiveProduct = async (id: number): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data: { archived: false },
  });
};
