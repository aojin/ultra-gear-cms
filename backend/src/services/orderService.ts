import { PrismaClient, Order } from "@prisma/client";

const prisma = new PrismaClient();

type OrderItemInput = {
  productId?: number;
  variantId?: number;
  quantity: number;
  price: number;
  productName: string;
};

type CreateOrderInput = {
  userId: number;
  totalAmount: number;
  orderItems: OrderItemInput[];
};

export const findUserById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address1: true,
      address2: true,
      phoneNumber: true,
    },
  });
};

export const createOrder = async (data: CreateOrderInput): Promise<Order> => {
  return await prisma.order.create({
    data: {
      userId: data.userId,
      totalAmount: data.totalAmount,
      orderItems: {
        create: data.orderItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
        })),
      },
    },
  });
};

export const getAllOrders = async (): Promise<Order[]> => {
  return await prisma.order.findMany({
    include: {
      orderItems: true,
    },
  });
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });
};

export const updateOrder = async (
  id: number,
  data: Partial<CreateOrderInput>
): Promise<Order> => {
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      userId: data.userId,
      totalAmount: data.totalAmount,
      orderItems: {
        deleteMany: {}, // Clear existing order items
        create: data.orderItems?.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
        })),
      },
    },
  });

  return updatedOrder;
};

export const deleteOrder = async (id: number): Promise<Order> => {
  return await prisma.order.delete({
    where: { id },
  });
};
