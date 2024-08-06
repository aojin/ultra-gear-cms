import { PrismaClient, OrderItem } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateOrderItemInput = {
  orderId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  productName: string;
  productVariantName?: string | null;
};

export const createOrderItem = async (
  data: CreateOrderItemInput
): Promise<OrderItem> => {
  return await prisma.orderItem.create({
    data: {
      order: { connect: { id: data.orderId } },
      productId: data.productId,
      productName: data.productName,
      productVariantId: data.variantId,
      productVariantName: data.productVariantName,
      quantity: data.quantity,
      price: data.price,
    },
  });
};

export const getAllOrderItems = async (): Promise<OrderItem[]> => {
  return await prisma.orderItem.findMany();
};

export const getOrderItemById = async (
  id: number
): Promise<OrderItem | null> => {
  return await prisma.orderItem.findUnique({
    where: { id },
  });
};

export const getOrderItemsByOrderId = async (
  orderId: number
): Promise<OrderItem[]> => {
  return await prisma.orderItem.findMany({
    where: { orderId },
  });
};

export const updateOrderItem = async (
  id: number,
  data: Partial<CreateOrderItemInput>
): Promise<OrderItem> => {
  return await prisma.orderItem.update({
    where: { id },
    data,
  });
};

export const archiveOrderItem = async (id: number): Promise<OrderItem> => {
  return await prisma.orderItem.update({
    where: { id },
    data: { archived: true },
  });
};

export const deleteOrderItem = async (id: number): Promise<OrderItem> => {
  return await prisma.orderItem.delete({
    where: { id },
  });
};
