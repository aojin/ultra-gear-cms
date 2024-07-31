// backend/controllers/orderController.js
const prisma = require("../prisma/prismaClient");

exports.createOrder = async (req, res) => {
  try {
    const order = await prisma.order.create({ data: req.body });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
