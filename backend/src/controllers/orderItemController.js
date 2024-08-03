import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, variantId, quantity, price } = req.body;

    if (!orderId || !productId || !quantity || !price) {
      return res.status(400).json({
        error: "OrderId, productId, quantity, and price are required",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    const variant = variantId
      ? await prisma.productVariant.findUnique({ where: { id: variantId } })
      : null;

    const orderItem = await prisma.orderItem.create({
      data: {
        order: { connect: { id: orderId } },
        productId,
        productName: product.name,
        productVariantId: variantId,
        productVariantName: variant ? variant.name : null,
        quantity,
        price,
      },
    });

    res.status(201).json(orderItem);
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany();
    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    console.error("Error fetching order item:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderItemsByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: parseInt(orderId, 10) },
    });
    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Error fetching order items by order ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { quantity, price } = req.body;

  if (!quantity || !price) {
    return res.status(400).json({ error: "Quantity and price are required" });
  }

  try {
    const orderItem = await prisma.orderItem.update({
      where: { id: parseInt(id, 10) },
      data: { quantity, price },
    });

    res.status(200).json(orderItem);
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({ error: error.message });
  }
};

export const archiveOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await prisma.orderItem.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });
    res.status(200).json(orderItem); // Ensure proper status code
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Order item not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orderItem.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting order item:", error);
    res.status(500).json({ error: error.message });
  }
};
