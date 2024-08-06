import { PrismaClient, CartItem } from "@prisma/client";

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
  return await prisma.cartItem.create({
    data: {
      cart: { connect: { id: data.cartId } },
      product: { connect: { id: data.productId } },
      variant: data.variantId ? { connect: { id: data.variantId } } : undefined,
      size: data.sizeId ? { connect: { id: data.sizeId } } : undefined,
      cartQuantity: data.cartQuantity,
      currentPrice: data.currentPrice,
    },
  });
};

export const getAllCartItems = async (): Promise<CartItem[]> => {
  return await prisma.cartItem.findMany();
};

export const updateCartItem = async (
  id: number,
  data: CreateCartItemInput
): Promise<CartItem> => {
  return await prisma.cartItem.update({
    where: { id },
    data: {
      cart: { connect: { id: data.cartId } },
      product: { connect: { id: data.productId } },
      variant: data.variantId ? { connect: { id: data.variantId } } : undefined,
      size: data.sizeId ? { connect: { id: data.sizeId } } : undefined,
      cartQuantity: data.cartQuantity,
      currentPrice: data.currentPrice,
    },
  });
};

export const deleteCartItem = async (id: number): Promise<CartItem> => {
  return await prisma.cartItem.delete({
    where: { id },
  });
};
