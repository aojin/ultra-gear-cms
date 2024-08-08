import { PrismaClient, Inventory, Prisma } from "@prisma/client";
import { Operation } from "../types";

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

export const findInventoryId = async (
  productId: number,
  variantId?: number,
  sizeId?: number
): Promise<number | null> => {
  console.log(
    `Finding inventory for Product ID: ${productId}, Variant ID: ${variantId}, Size ID: ${sizeId}`
  );

  let inventory;

  if (sizeId) {
    inventory = await prisma.inventory.findFirst({
      where: {
        productId,
        variantId,
        sizeId,
      },
    });
  } else if (variantId) {
    inventory = await prisma.inventory.findFirst({
      where: {
        productId,
        variantId,
      },
    });
  } else {
    inventory = await prisma.inventory.findFirst({
      where: {
        productId,
      },
    });
  }

  console.log(
    `Found inventory: id-${inventory?.id || null} quantity-${
      inventory?.quantity
    }`
  );

  return inventory ? inventory.id : null;
};

export const updateInventory = async (
  id: number,
  amount: number,
  operation: "increment" | "decrement"
) => {
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      product: true,
      variant: true,
      size: true,
    },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  const updatedQuantity =
    operation === "increment"
      ? inventory.quantity + amount
      : inventory.quantity - amount;

  await prisma.inventory.update({
    where: { id },
    data: { quantity: updatedQuantity },
  });

  if (inventory.size) {
    await prisma.size.update({
      where: { id: inventory.size.id },
      data: { quantity: updatedQuantity },
    });

    if (inventory.size.variantId) {
      await updateVariantTotalQuantity(inventory.size.variantId);

      const productVariant = await prisma.productVariant.findUnique({
        where: { id: inventory.size.variantId },
        include: { product: true },
      });

      if (productVariant?.productId) {
        await updateProductTotalQuantity(productVariant.productId);
      }
    } else if (inventory.productId) {
      await updateProductTotalQuantity(inventory.productId);
    }
  } else if (inventory.variant) {
    await prisma.productVariant.update({
      where: { id: inventory.variant.id },
      data: { quantity: updatedQuantity },
    });

    if (inventory.variant.productId) {
      await updateProductTotalQuantity(inventory.variant.productId);
    }
  } else if (inventory.productId) {
    await updateProductTotalQuantity(inventory.productId);
  }

  const updatedInventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      product: true,
      variant: true,
      size: true,
    },
  });

  return updatedInventory;
};

const updateVariantTotalQuantity = async (variantId: number) => {
  const inventories = await prisma.inventory.findMany({
    where: { variantId },
  });

  const totalQuantity = inventories.reduce(
    (sum, inventory) => sum + inventory.quantity,
    0
  );

  await prisma.productVariant.update({
    where: { id: variantId },
    data: { quantity: totalQuantity },
  });
};

const updateProductTotalQuantity = async (productId: number) => {
  const inventories = await prisma.inventory.findMany({
    where: { productId },
  });

  const totalQuantity = inventories.reduce(
    (sum, inventory) => sum + inventory.quantity,
    0
  );

  await prisma.product.update({
    where: { id: productId },
    data: { quantity: totalQuantity },
  });
};
