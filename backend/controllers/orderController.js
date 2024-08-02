// backend/controllers/orderController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  const { userId, totalAmount, orderItems } = req.body;

  try {
    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: {
        id: true,
        name: true,
        email: true,
        address1: true,
        address2: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userAddress1: user.address1,
        userAddress2: user.address2,
        userPhoneNumber: user.phoneNumber,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        totalAmount: req.body.totalAmount,
        orderItems: {
          deleteMany: {}, // Delete existing order items
          create: req.body.orderItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.archiveOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: {
        archived: true,
        orderItems: { updateMany: { data: { archived: true }, where: {} } },
      },
    });
    res.status(200).json(order); // Ensure proper status code
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.permanentlyDeleteOrder = async (req, res) => {
  try {
    await prisma.order.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: { orderItems: true },
    });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId, 10) },
      include: { orderItems: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
