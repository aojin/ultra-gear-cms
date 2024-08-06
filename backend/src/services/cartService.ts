import { PrismaClient, Cart, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface CartItemInput {
  productId: number;
  variantId?: number | null;
  sizeId?: number | null;
  cartQuantity: number;
  currentPrice: number;
}

export const createCart = async (
  userId: number,
  items: CartItemInput[]
): Promise<Cart> => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    return await prisma.cart.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: item.variantId
              ? { connect: { id: item.variantId } }
              : undefined,
            size: item.sizeId ? { connect: { id: item.sizeId } } : undefined,
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error("Service: Error creating cart:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create cart");
    }
  }
};

export const getAllCarts = async (): Promise<Cart[]> => {
  try {
    return await prisma.cart.findMany({
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error("Service: Error fetching carts:", error);
    throw new Error("Service Error: Failed to fetch carts");
  }
};

export const updateCart = async (
  id: number,
  items: CartItemInput[]
): Promise<Cart> => {
  try {
    return await prisma.cart.update({
      where: { id },
      data: {
        items: {
          deleteMany: {},
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: item.variantId
              ? { connect: { id: item.variantId } }
              : undefined,
            size: item.sizeId ? { connect: { id: item.sizeId } } : undefined,
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error("Service: Error updating cart:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update cart");
    }
  }
};

export const deleteCart = async (id: number): Promise<void> => {
  try {
    await prisma.cart.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service: Error deleting cart:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete cart");
    }
  }
};
