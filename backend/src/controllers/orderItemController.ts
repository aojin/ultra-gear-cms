import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  updateOrderItem,
  archiveOrderItem,
  deleteOrderItem,
  CreateOrderItemInput,
} from "../services/orderItemService";
import { getProductById } from "../services/productService";
import { getProductVariantById } from "../services/productVariantService";
import { Request, Response } from "express";

export const createOrderItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    orderId,
    productId,
    productVariantId,
    quantity,
    price,
    productName,
    productVariantName,
  }: CreateOrderItemInput = req.body;

  // Validate input
  if (
    !orderId ||
    !productId ||
    quantity === undefined ||
    quantity <= 0 ||
    price === undefined ||
    price <= 0
  ) {
    res.status(400).json({
      error:
        "Invalid input: orderId, productId, quantity, and price are required. Quantity and price must be positive numbers.",
    });
    return;
  }

  try {
    const product = await getProductById(productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const variant = productVariantId
      ? await getProductVariantById(productVariantId)
      : null;

    const orderItem = await createOrderItem({
      orderId,
      productId,
      productName: product.name,
      productVariantId,
      productVariantName: variant ? variant.name : undefined,
      quantity,
      price,
    });

    res.status(201).json(orderItem);
  } catch (error) {
    console.error("Controller: Error creating order item:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllOrderItemsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderItems = await getAllOrderItems();
    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Controller: Error fetching order items:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrderItemByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderItem = await getOrderItemById(parseInt(req.params.id, 10));
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    console.error("Controller: Error fetching order item by ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrderItemsByOrderIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { orderId } = req.params;
  try {
    const orderItems = await getOrderItemsByOrderId(parseInt(orderId, 10));
    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Controller: Error fetching order items by order ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateOrderItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { quantity, price } = req.body;

  if (!quantity || !price) {
    res.status(400).json({ error: "Quantity and price are required" });
    return;
  }

  try {
    const orderItem = await updateOrderItem(parseInt(id, 10), {
      quantity,
      price,
    });

    res.status(200).json(orderItem);
  } catch (error) {
    console.error("Controller: Error updating order item:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const archiveOrderItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const orderItem = await archiveOrderItem(parseInt(id, 10));
    res.status(200).json(orderItem);
  } catch (error) {
    console.error("Controller: Error archiving order item:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteOrderItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteOrderItem(parseInt(id, 10));
    res.status(204).end();
  } catch (error) {
    console.error("Controller: Error deleting order item:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
