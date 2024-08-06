import { PrismaClient, CartItem } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateCartItemInput {
  cartId: number;
  productId: number;
  variantId?: number | null;
  sizeId?: number | null;
  cartQuantity: number;
  currentPrice: number;
}

export const createCartItem = async (
  data: CreateCartItemInput
): Promise<CartItem> => {
  try {
    return await prisma.cartItem.create({
      data: {
        cart: { connect: { id: data.cartId } },
        product: { connect: { id: data.productId } },
        variant: data.variantId
          ? { connect: { id: data.variantId } }
          : undefined,
        size: data.sizeId ? { connect: { id: data.sizeId } } : undefined,
        cartQuantity: data.cartQuantity,
        currentPrice: data.currentPrice,
      },
    });
  } catch (error: any) {
    console.error("Service: Error creating cart item:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to create cart item",
      };
    }
  }
};

export const getAllCartItems = async (): Promise<CartItem[]> => {
  try {
    return await prisma.cartItem.findMany();
  } catch (error: any) {
    console.error("Service: Error fetching cart items:", error.message);
    throw {
      statusCode: 500,
      message: "Service Error: Failed to fetch cart items",
    };
  }
};

export const updateCartItem = async (
  id: number,
  data: CreateCartItemInput
): Promise<CartItem> => {
  try {
    return await prisma.cartItem.update({
      where: { id },
      data: {
        cart: { connect: { id: data.cartId } },
        product: { connect: { id: data.productId } },
        variant: data.variantId
          ? { connect: { id: data.variantId } }
          : undefined,
        size: data.sizeId ? { connect: { id: data.sizeId } } : undefined,
        cartQuantity: data.cartQuantity,
        currentPrice: data.currentPrice,
      },
    });
  } catch (error: any) {
    console.error("Service: Error updating cart item:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to update cart item",
      };
    }
  }
};

export const deleteCartItem = async (id: number): Promise<CartItem> => {
  try {
    return await prisma.cartItem.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Service: Error deleting cart item:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw {
        statusCode: 400,
        message: "Unique constraint violation or other known error",
      };
    } else {
      throw {
        statusCode: 500,
        message: "Service Error: Failed to delete cart item",
      };
    }
  }
};
