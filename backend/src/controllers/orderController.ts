import {
  findUserById,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../services/orderService";
import { Request, Response } from "express";

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

export const createOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, totalAmount, orderItems }: CreateOrderInput = req.body;

  try {
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    try {
      const order = await createOrder({
        userId: user.id,
        totalAmount,
        orderItems,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Service: Error creating order:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Controller: Error finding user:", error);
    res.status(500).json({ error: error.message });
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
    console.error("Service: Error fetching orders:", error);
    res.status(500).json({ error: error.message });
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
    console.error("Service: Error fetching order by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId, totalAmount, orderItems }: Partial<CreateOrderInput> =
    req.body;

  try {
    const order = await updateOrder(parseInt(id, 10), {
      userId,
      totalAmount,
      orderItems,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Service: Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteOrder(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    console.error("Service: Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};
