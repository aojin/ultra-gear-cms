// backend/controllers/cartController.js
const prisma = require("../prisma/prismaClient");

exports.createCart = async (req, res) => {
  try {
    const cart = await prisma.cart.create({ data: req.body });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await prisma.cart.findMany();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await prisma.cart.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await prisma.cart.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
