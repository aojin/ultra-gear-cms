const prisma = require("../prisma/prismaClient");

exports.createCartItem = async (req, res) => {
  try {
    const cartItem = await prisma.cartItem.create({
      data: req.body,
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await prisma.cartItem.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
