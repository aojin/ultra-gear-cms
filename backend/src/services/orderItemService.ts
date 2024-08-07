import { PrismaClient, OrderItem, CartItem, Prisma } from "@prisma/client";
import { decrementInventory } from "./inventoryService";

const prisma = new PrismaClient();

export type CreateOrderItemInput = {
  orderId: number;
  productId: number;
  productVariantId?: number;
  quantity: number;
  price: number;
  productName: string;
  productVariantName?: string;
};

export const createOrderItem = async (
  data: CreateOrderItemInput
): Promise<OrderItem> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error(`Product with id ${data.productId} not found`);
    }

    const variant = data.productVariantId
      ? await prisma.productVariant.findUnique({
          where: { id: data.productVariantId },
        })
      : null;

    return await prisma.orderItem.create({
      data: {
        order: { connect: { id: data.orderId } },
        productId: data.productId,
        productVariantId: data.productVariantId,
        productName: product.name,
        productVariantName: variant ? variant.name : null,
        quantity: data.quantity,
        price: data.price,
      },
    });
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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

export const createOrderItems = async (
  orderId: number,
  cartItems: CartItem[]
): Promise<OrderItem[]> => {
  try {
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: cartItem.productId },
        select: { name: true },
      });

      const productVariant = cartItem.variantId
        ? await prisma.productVariant.findUnique({
            where: { id: cartItem.variantId },
            select: { name: true },
          })
        : null;

      if (product) {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId,
            productId: cartItem.productId,
            productName: product.name,
            productVariantId: cartItem.variantId ?? undefined,
            productVariantName: productVariant?.name ?? null,
            quantity: cartItem.cartQuantity,
            price: cartItem.currentPrice,
          },
        });

        orderItems.push(orderItem);
      }
    }

    return orderItems;
  } catch (error) {
    console.error("Error creating order items:", error);
    throw new Error("Failed to create order items");
  }
};
