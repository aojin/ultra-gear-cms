import { PrismaClient, Cart, Prisma, CartItem } from "@prisma/client";
import { CreateCartItemInput } from "./cartItemService";

const prisma = new PrismaClient();

export const createCart = async (
  userId: number,
  items: CreateCartItemInput[]
): Promise<Cart> => {
  try {
    // Create cart with items
    const cart = await prisma.cart.create({
      data: {
        userId: userId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            sizeId: item.sizeId ?? null,
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: {
        items: true, // Include items if you need them in the response
      },
    });

    return cart;
  } catch (error) {
    console.error("Service: Error creating cart:", error);
    throw new Error("Failed to create cart");
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
  items: CreateCartItemInput[]
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

export const getCartItemsByUserId = async (
  userId: number
): Promise<CartItem[]> => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { cart: { userId } },
      include: {
        product: true,
        variant: true,
        size: true, // Include size if applicable
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error) {
    console.error("Service: Error fetching cart items by user ID:", error);
    throw new Error("Service Error: Failed to fetch cart items by user ID");
  }
};

export const clearCart = async (userId: number): Promise<void> => {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });
  } catch (error) {
    console.error("Service: Error clearing cart:", error);
    throw new Error("Service Error: Failed to clear cart");
  }
};
export { CreateCartItemInput };
