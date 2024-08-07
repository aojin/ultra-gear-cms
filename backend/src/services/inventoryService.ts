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
  } catch (error) {
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

export const getInventoryByProductId = async (
  productId: number
): Promise<{ product: Inventory | null; variants: Inventory[] }> => {
  try {
    const productInventory = await prisma.inventory.findFirst({
      where: { productId, variantId: null },
    });

    const variantInventories = await prisma.inventory.findMany({
      where: { productId, variantId: { not: null } },
    });

    return { product: productInventory, variants: variantInventories };
  } catch (error: any) {
    console.error("Service: Error fetching product inventory:", error);
    throw new Error("Service Error: Failed to fetch product inventory");
  }
};

export const getInventoryByVariantId = async (
  variantId: number
): Promise<Inventory[]> => {
  try {
    return await prisma.inventory.findMany({
      where: { variantId },
    });
  } catch (error: any) {
    console.error("Service: Error fetching variant inventory:", error);
    throw new Error("Service Error: Failed to fetch variant inventory");
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

export const incrementInventory = async (
  id: number,
  amount: number,
  variantId?: number,
  sizeId?: number
): Promise<Inventory> => {
  try {
    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: {
          increment: amount,
        },
      },
    });

    if (sizeId) {
      await updateVariantQuantityFromSizes(sizeId);
    }
    if (variantId) {
      await updateVariantQuantityFromSizes(variantId);
    }
    if (inventory.productId) {
      await updateProductQuantityFromVariants(inventory.productId);
    }

    return inventory;
  } catch (error: any) {
    console.error("Service: Error incrementing inventory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to increment inventory");
    }
  }
};

export const decrementInventory = async (
  productId: number,
  quantity: number,
  variantId?: number,
  sizeId?: number
): Promise<Inventory> => {
  try {
    // Decrement the inventory quantity based on sizeId, variantId, or productId
    if (sizeId) {
      await prisma.size.update({
        where: { id: sizeId },
        data: { quantity: { decrement: quantity } },
      });
    } else if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { quantity: { decrement: quantity } },
      });
    } else {
      await prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });
    }

    // Fetch and return the updated inventory record
    const inventory = await prisma.inventory.findUnique({
      where: { id: productId }, // Assuming `id` is the primary key
    });

    if (inventory?.variantId) {
      await updateVariantQuantityFromSizes(inventory.variantId);
    }
    if (inventory?.productId) {
      await updateProductQuantityFromVariants(inventory.productId);
    }

    return inventory!;
  } catch (error: any) {
    console.error("Service: Error decrementing inventory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to decrement inventory");
    }
  }
};

export const updateProductQuantityFromVariants = async (productId: number) => {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    include: { inventory: true },
  });
  const totalQuantity = variants.reduce((sum, variant) => {
    return (
      sum +
      (variant.inventory?.reduce((invSum, inv) => invSum + inv.quantity, 0) ||
        0)
    );
  }, 0);
  await prisma.product.update({
    where: { id: productId },
    data: { quantity: totalQuantity },
  });
};

export const updateVariantQuantityFromSizes = async (variantId: number) => {
  const sizes = await prisma.size.findMany({
    where: { variantId },
  });
  const totalQuantity = sizes.reduce((sum, size) => {
    return sum + size.quantity;
  }, 0);
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { quantity: totalQuantity },
  });
};
