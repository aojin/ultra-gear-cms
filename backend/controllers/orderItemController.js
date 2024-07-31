// backend/controllers/orderItemController.js
const prisma = require("../prisma/prismaClient");

exports.createOrderItem = async (req, res) => {
  try {
    const orderItem = await prisma.orderItem.create({ data: req.body });
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await prisma.orderItem.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const orderItem = await prisma.orderItem.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
