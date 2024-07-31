const prisma = require("../prisma/prismaClient");

exports.createCartItem = async (req, res) => {
  const { cartId, productId, quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
    res.status(200).json(cartItem);
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
  const { quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.update({
      where: { id: Number(id) },
      data: { quantity },
    });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await prisma.cartItem.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
