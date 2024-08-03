import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    console.log("Request body:", req.body);

    const cart = await prisma.cart.create({
      data: {
        user: { connect: { id: userId } },
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: { connect: { id: item.variantId } },
            size: { connect: { id: item.sizeId } },
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const carts = await prisma.cart.findMany({
      include: { items: true },
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  try {
    const cart = await prisma.cart.update({
      where: { id: parseInt(id, 10) },
      data: {
        items: {
          deleteMany: {}, // Clear existing items
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            variant: { connect: { id: item.variantId } },
            size: { connect: { id: item.sizeId } },
            cartQuantity: item.cartQuantity,
            currentPrice: item.currentPrice,
          })),
        },
      },
      include: { items: true },
    });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: "Cart ID is required" });
    }

    await prisma.cart.delete({
      where: { id: parseInt(id, 10) }, // Ensure id is correctly parsed
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: error.message });
  }
};
