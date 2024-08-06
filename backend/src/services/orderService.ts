import { PrismaClient, Order, Prisma } from "@prisma/client";

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
  try {
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
  } catch (error) {
    console.error("Service: Error finding user by ID:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to find user by ID");
    }
  }
};

export const createOrder = async (data: CreateOrderInput): Promise<Order> => {
  try {
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
  } catch (error) {
    console.error("Service: Error creating order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create order");
    }
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });
  } catch (error) {
    console.error("Service: Error fetching orders:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to fetch orders");
    }
  }
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
  } catch (error) {
    console.error("Service: Error fetching order by ID:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to fetch order by ID");
    }
  }
};

export const updateOrder = async (
  id: number,
  data: Partial<CreateOrderInput>
): Promise<Order> => {
  try {
    return await prisma.order.update({
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
  } catch (error) {
    console.error("Service: Error updating order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update order");
    }
  }
};

export const deleteOrder = async (id: number): Promise<Order> => {
  try {
    return await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service: Error deleting order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete order");
    }
  }
};
