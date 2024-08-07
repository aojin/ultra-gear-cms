import { Request, Response } from "express";
import {
  createCart,
  getAllCarts,
  updateCart,
  deleteCart,
  CreateCartItemInput,
} from "../services/cartService";
import { getCartItemsByUserId, clearCart } from "../services/cartService";
import {
  createOrder,
  decrementInventory,
  updateOrder,
} from "../services/orderService";
import { createOrderItems } from "../services/orderItemService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, items } = req.body;
    if (!userId || !items) {
      res
        .status(400)
        .json({ error: "Controller: User ID and items are required" });
      return;
    }

    const cart = await createCart(userId, items as CreateCartItemInput[]);
    res.status(201).json(cart);
  } catch (error) {
    console.error("Controller: Error creating cart:", error);
    res.status(500).json({ error: "Controller Error: Failed to create cart" });
  }
};

export const getAllCartsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const carts = await getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    console.error("Controller: Error fetching carts:", error);
    res.status(500).json({ error: "Controller Error: Failed to fetch carts" });
  }
};

export const updateCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { items } = req.body;
  if (!id || !items) {
    res
      .status(400)
      .json({ error: "Controller: Cart ID and items are required" });
    return;
  }

  try {
    const cart = await updateCart(
      parseInt(id, 10),
      items as CreateCartItemInput[]
    );
    res.status(200).json(cart);
  } catch (error) {
    console.error("Controller: Error updating cart:", error);
    res.status(500).json({ error: "Controller Error: Failed to update cart" });
  }
};

export const deleteCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Cart ID is required" });
    return;
  }

  try {
    await deleteCart(parseInt(id, 10));
    res.status(204).end();
  } catch (error) {
    console.error("Controller: Error deleting cart:", error);
    res.status(500).json({ error: "Controller Error: Failed to delete cart" });
  }
};

export const buyCartItemsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  try {
    // Fetch cart items for the user
    const cartItems = await getCartItemsByUserId(userId);

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: "No items in cart" });
      return;
    }

    // Fetch product names and calculate total amount
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }

        return {
          productId: item.productId,
          productVariantId: item.variantId,
          quantity: item.cartQuantity,
          price: item.currentPrice,
          productName: product.name,
        };
      })
    );

    // Calculate total amount
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Create an order
    // const order = await createOrder(userId, totalAmount, orderItems);

    // Decrement inventory for each item in the order
    for (const item of cartItems) {
      await decrementInventory(
        item.productId,
        item.cartQuantity,
        item.variantId ?? null,
        item.sizeId ?? null
      );
    }

    // Clear the cart for the user
    await clearCart(userId);

    res.status(200).json("commenting out order");
  } catch (error) {
    console.error("Error in buyCartItemsHandler:", error);
    res.status(500).json({ error: "Failed to process the order" });
  }
};
