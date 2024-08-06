import { PrismaClient, Cart } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface CartItemInput {
  productId: number;
  variantId: number;
  sizeId: number;
  cartQuantity: number;
  currentPrice: number;
}

export const createCart = async (
  userId: number,
  items: CartItemInput[]
): Promise<Cart> => {
  try {
    return await prisma.cart.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: { connect: { id: item.variantId } },
            size: { connect: { id: item.sizeId } },
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: { items: true },
    });
  } catch (error: any) {
    console.error("Service: Error creating cart:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to create cart",
      };
    }
  }
};

export const getAllCarts = async (): Promise<Cart[]> => {
  try {
    return await prisma.cart.findMany({
      include: { items: true },
    });
  } catch (error: any) {
    console.error("Service: Error fetching carts:", error.message);
    throw { statusCode: 500, message: "Service Error: Failed to fetch carts" };
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
          deleteMany: {}, // Clear existing items
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: { connect: { id: item.variantId } },
            size: { connect: { id: item.sizeId } },
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: { items: true },
    });
  } catch (error: any) {
    console.error("Service: Error updating cart:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to update cart",
      };
    }
  }
};

export const deleteCart = async (id: number): Promise<Cart> => {
  try {
    return await prisma.cart.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error deleting cart:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to delete cart",
      };
    }
  }
};
