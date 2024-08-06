import { PrismaClient, OrderItem, Prisma } from "@prisma/client";

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
  try {
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
  } catch (error) {
    console.error("Service: Error creating order item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create order item");
    }
  }
};

export const getAllOrderItems = async (): Promise<OrderItem[]> => {
  try {
    return await prisma.orderItem.findMany();
  } catch (error) {
    console.error("Service: Error fetching order items:", error);
    throw new Error("Service Error: Failed to fetch order items");
  }
};

export const getOrderItemById = async (
  id: number
): Promise<OrderItem | null> => {
  try {
    return await prisma.orderItem.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Service: Error fetching order item by ID:", error);
    throw new Error("Service Error: Failed to fetch order item by ID");
  }
};

export const getOrderItemsByOrderId = async (
  orderId: number
): Promise<OrderItem[]> => {
  try {
    return await prisma.orderItem.findMany({
      where: { orderId },
    });
  } catch (error) {
    console.error("Service: Error fetching order items by order ID:", error);
    throw new Error("Service Error: Failed to fetch order items by order ID");
  }
};

export const updateOrderItem = async (
  id: number,
  data: Partial<CreateOrderItemInput>
): Promise<OrderItem> => {
  try {
    return await prisma.orderItem.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Service: Error updating order item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update order item");
    }
  }
};

export const archiveOrderItem = async (id: number): Promise<OrderItem> => {
  try {
    return await prisma.orderItem.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service: Error archiving order item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive order item");
    }
  }
};

export const deleteOrderItem = async (id: number): Promise<OrderItem> => {
  try {
    return await prisma.orderItem.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service: Error deleting order item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete order item");
    }
  }
};
