import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  archiveOrder,
  unarchiveOrder,
  permanentlyDeleteOrder,
  findUserById,
} from "../services/orderService";
import { Request, Response } from "express";
import {
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderItemInput,
} from "../types"; // Adjust the import path as necessary

export const createOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, totalAmount, orderItems } = req.body;

  try {
    if (
      !userId ||
      !totalAmount ||
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    for (const item of orderItems) {
      if (
        !item.productId ||
        !item.quantity ||
        !item.price ||
        !item.productName
      ) {
        res
          .status(400)
          .json({ error: "Order items are missing required fields" });
        return;
      }
    }

    const newOrder = await createOrder(userId, totalAmount, orderItems);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Controller: Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getAllOrdersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Controller: Error fetching orders:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrderByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await getOrderById(parseInt(req.params.id, 10));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Controller: Error fetching order by ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId, totalAmount, orderItems }: UpdateOrderInput = req.body;

  try {
    const order = await updateOrder(parseInt(id, 10), {
      userId,
      totalAmount,
      orderItems,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Controller: Error updating order:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const permanentlyDeleteOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await permanentlyDeleteOrder(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    console.error("Controller: Error permanently deleting order:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const archiveOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const order = await getOrderById(parseInt(id, 10));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const archivedOrder = await archiveOrder(parseInt(id, 10));
    res.status(200).json(archivedOrder);
  } catch (error) {
    console.error("Controller: Error archiving order:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const unarchiveOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const order = await getOrderById(parseInt(id, 10));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const unarchivedOrder = await unarchiveOrder(parseInt(id, 10));
    res.status(200).json(unarchivedOrder);
  } catch (error) {
    console.error("Controller: Error unarchiving order:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
