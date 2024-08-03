// import { PrismaClient } from "@prisma/client";

// // const prisma = new PrismaClient();

export const createProduct = async (prisma, data) => {
  return await prisma.product.create({ data });
};

export const getAllProducts = async (prisma) => {
  return await prisma.product.findMany();
};

export const getProductById = async (prisma, id) => {
  return await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

export const updateProduct = async (prisma, id, data) => {
  return await prisma.product.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

export const deleteProductPermanently = async (prisma, id) => {
  return await prisma.product.delete({
    where: { id: parseInt(id, 10) },
  });
};

export const archiveProduct = async (prisma, id) => {
  const product = await prisma.product.update({
    where: { id: parseInt(id, 10) },
    data: { archived: true },
  });

  await prisma.productVariant.updateMany({
    where: { productId: product.id },
    data: { archived: true },
  });

  await prisma.productImage.updateMany({
    where: { productId: product.id },
    data: { archived: true },
  });

  await prisma.size.updateMany({
    where: { productId: product.id },
    data: { archived: true },
  });

  return product;
};

export const unarchiveProduct = async (prisma, id) => {
  const product = await prisma.product.update({
    where: { id: parseInt(id, 10) },
    data: { archived: false },
  });

  await prisma.productVariant.updateMany({
    where: { productId: product.id },
    data: { archived: false },
  });

  await prisma.productImage.updateMany({
    where: { productId: product.id },
    data: { archived: false },
  });

  await prisma.size.updateMany({
    where: { productId: product.id },
    data: { archived: false },
  });

  return product;
};
