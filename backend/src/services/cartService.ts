import { PrismaClient, Cart } from "@prisma/client";

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
};

export const getAllCarts = async (): Promise<Cart[]> => {
  return await prisma.cart.findMany({
    include: { items: true },
  });
};

export const updateCart = async (
  id: number,
  items: CartItemInput[]
): Promise<Cart> => {
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
};

export const deleteCart = async (id: number): Promise<Cart> => {
  return await prisma.cart.delete({
    where: { id },
  });
};
