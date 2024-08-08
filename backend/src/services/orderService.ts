import { PrismaClient, Order, Prisma } from "@prisma/client";
import { CreateOrderItemInput, UpdateOrderInput } from "../types";

const prisma = new PrismaClient();

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
    throw new Error("Service Error: Failed to find user by ID");
  }
};

export const createOrder = async (
  userId: number,
  orderItems: CreateOrderItemInput[]
): Promise<Order> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.order.create({
    data: {
      userId,
      userName: user.name,
      userEmail: user.email,
      userAddress1: user.address1,
      userAddress2: user.address2,
      userPhoneNumber: user.phoneNumber,
      orderItems: {
        create: orderItems.map((item) => ({
          productId: item.productId,
          productVariantId: item.productVariantId || null,
          quantity: item.quantity ?? 0, // Ensure quantity is always a number
          price: item.price ?? 0.0, // Ensure price is always a number
          productName: item.productName || "", // Ensure productName is always a string
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });
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
  data: UpdateOrderInput
): Promise<Order> => {
  try {
    return await prisma.order.update({
      where: { id },
      data: {
        userId: data.userId,
        orderItems: data.orderItems
          ? {
              deleteMany: {}, // Clear existing order items
              create: data.orderItems.map((item) => ({
                productId: item.productId,
                productVariantId: item.productVariantId || null,
                quantity: item.quantity ?? 0, // Ensure quantity is always a number
                price: item.price ?? 0.0, // Ensure price is always a number
                productName: item.productName || "", // Ensure productName is always a string
              })),
            }
          : undefined,
      },
      include: {
        orderItems: true, // Ensure orderItems are included in the response
      },
    });
  } catch (error) {
    console.error("Service: Error updating order:", error);
    throw new Error("Service Error: Failed to update order");
  }
};

export const permanentlyDeleteOrder = async (id: number): Promise<Order> => {
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

export const archiveOrder = async (id: number): Promise<Order> => {
  try {
    return await prisma.order.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service: Error archiving order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive order");
    }
  }
};

export const unarchiveOrder = async (id: number): Promise<Order> => {
  try {
    return await prisma.order.update({
      where: { id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service: Error unarchiving order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to unarchive order");
    }
  }
};
