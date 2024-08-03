import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProductVariant = async (data) => {
  return await prisma.productVariant.create({ data });
};

export const getAllProductVariants = async () => {
  return await prisma.productVariant.findMany();
};

export const getProductVariantById = async (id) => {
  return await prisma.productVariant.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

export const updateProductVariant = async (id, data) => {
  return await prisma.productVariant.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

export const deleteProductVariant = async (id) => {
  return await prisma.productVariant.delete({
    where: { id: parseInt(id, 10) },
  });
};

export const archiveProductVariant = async (id) => {
  return await prisma.productVariant.update({
    where: { id: parseInt(id, 10) },
    data: { archived: true },
  });
};

export const unarchiveProductVariant = async (id) => {
  return await prisma.productVariant.update({
    where: { id: parseInt(id, 10) },
    data: { archived: false },
  });
};
