import { PrismaClient, Cart, CartItem, Product } from "@prisma/client";
import { CreateCartItemInput } from "../types";

const prisma = new PrismaClient();

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export const createCart = async (
  userId: number,
  items: CreateCartItemInput[]
): Promise<CartWithItems> => {
  try {
    const cart = await prisma.cart.create({
      data: {
        userId,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart as CartWithItems;
  } catch (error) {
    console.error("Service: Error creating cart:", error);
    throw new Error("Service Error: Failed to create cart");
  }
};

export const getAllCarts = async (): Promise<CartWithItems[]> => {
  try {
    return (await prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })) as CartWithItems[];
  } catch (error) {
    console.error("Service: Error fetching carts:", error);
    throw new Error("Service Error: Failed to fetch carts");
  }
};

export const deleteCart = async (id: number): Promise<void> => {
  try {
    await prisma.cart.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service: Error deleting cart:", error);
    throw new Error("Service Error: Failed to delete cart");
  }
};

export const addCartItemToCart = async (
  cartId: number,
  item: CreateCartItemInput
): Promise<CartWithItems> => {
  try {
    const updatedCart = await prisma.cart.update({
      where: { id: cartId },
      data: {
        items: {
          create: item,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedCart as CartWithItems;
  } catch (error) {
    console.error("Service: Error adding item to cart:", error);
    throw new Error("Service Error: Failed to add item to cart");
  }
};

export const removeCartItemFromCart = async (
  cartId: number,
  itemId: number
): Promise<CartWithItems> => {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatedCart) {
      throw new Error(`Cart with id ${cartId} not found`);
    }

    return updatedCart as CartWithItems;
  } catch (error) {
    console.error("Service: Error removing item from cart:", error);
    throw new Error("Service Error: Failed to remove item from cart");
  }
};

export const clearCart = async (userId: number): Promise<void> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  } catch (error) {
    console.error("Service: Error clearing cart:", error);
    throw new Error("Service Error: Failed to clear cart");
  }
};

export const getCartByUserId = async (
  userId: number
): Promise<CartWithItems | null> => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart as CartWithItems | null;
  } catch (error) {
    console.error("Service: Error fetching cart items by user ID:", error);
    throw new Error("Service Error: Failed to fetch cart items by user ID");
  }
};

export const getCartItemsByCartId = async (
  cartId: number
): Promise<CartItem[]> => {
  try {
    return await prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      },
    });
  } catch (error) {
    console.error("Service: Error fetching cart items by cart ID:", error);
    throw new Error("Service Error: Failed to fetch cart items by cart ID");
  }
};
