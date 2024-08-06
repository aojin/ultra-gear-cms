import { PrismaClient, Inventory, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createInventory = async (data: {
  productId?: number;
  variantId?: number;
  sizeId?: number;
  quantity: number;
}): Promise<Inventory> => {
  try {
    return await prisma.inventory.create({
      data,
    });
  } catch (error: any) {
    console.error("Service: Error creating inventory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create inventory");
    }
  }
};

export const getAllInventories = async (): Promise<Inventory[]> => {
  try {
    return await prisma.inventory.findMany();
  } catch (error: any) {
    console.error("Service: Error fetching inventories:", error);
    throw new Error("Service Error: Failed to fetch inventories");
  }
};

export const getInventoryById = async (
  id: number
): Promise<Inventory | null> => {
  try {
    return await prisma.inventory.findUnique({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error fetching inventory by ID:", error);
    throw new Error("Service Error: Failed to fetch inventory by ID");
  }
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
  try {
    return await prisma.inventory.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    console.error("Service: Error updating inventory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update inventory");
    }
  }
};

export const deleteInventory = async (id: number): Promise<Inventory> => {
  try {
    return await prisma.inventory.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error deleting inventory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete inventory");
    }
  }
};
