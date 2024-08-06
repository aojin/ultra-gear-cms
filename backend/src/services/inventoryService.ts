import { PrismaClient, Inventory } from "@prisma/client";

const prisma = new PrismaClient();

export const createInventory = async (data: {
  productId?: number;
  variantId?: number;
  sizeId?: number;
  quantity: number;
}): Promise<Inventory> => {
  return await prisma.inventory.create({
    data,
  });
};

export const getAllInventories = async (): Promise<Inventory[]> => {
  return await prisma.inventory.findMany();
};

export const getInventoryById = async (
  id: number
): Promise<Inventory | null> => {
  return await prisma.inventory.findUnique({
    where: { id },
  });
};

export const updateInventory = async (
  id: number,
  data: {
    productId?: number;
    variantId?: number;
    sizeId?: number;
    quantity: number;
  }
): Promise<Inventory> => {
  return await prisma.inventory.update({
    where: { id },
    data,
  });
};

export const deleteInventory = async (id: number): Promise<Inventory> => {
  return await prisma.inventory.delete({
    where: { id },
  });
};
