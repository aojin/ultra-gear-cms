import { PrismaClient, Order, Prisma } from "@prisma/client";
import {
  CreateOrderItemInput,
  UpdateOrderItemInput,
  UpdateOrderInput,
} from "../types";

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
  totalAmount: number,
  orderItems: Array<{
    productId: number;
    quantity: number;
    price: number;
    productName: string;
  }>
): Promise<Order> => {
  return await prisma.order.create({
    data: {
      userId,
      totalAmount,
      orderItems: {
        create: orderItems,
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
        totalAmount: data.totalAmount,
        orderItems: data.orderItems
          ? {
              deleteMany: {}, // Clear existing order items
              create: data.orderItems.map((item) => ({
                productId: item.productId,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                price: item.price,
                productName: item.productName,
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

export const decrementInventory = async (
  productId: number,
  quantity: number,
  variantId?: number | null,
  sizeId?: number | null
): Promise<void> => {
  try {
    // Decrement inventory for the size, if sizeId is provided
    if (sizeId) {
      await prisma.inventory.updateMany({
        where: {
          productId,
          sizeId,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    }
    // Decrement inventory for the variant, if variantId is provided
    else if (variantId) {
      await prisma.inventory.updateMany({
        where: {
          productId,
          variantId,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    }
    // Decrement inventory for the product without variant or size
    else {
      await prisma.inventory.updateMany({
        where: {
          productId,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error decrementing inventory:", error);
    throw new Error("Failed to decrement inventory");
  }
};
