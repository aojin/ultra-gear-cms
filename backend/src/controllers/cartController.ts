import { Request, Response } from "express";
import {
  createCart,
  getAllCarts,
  deleteCart,
  addCartItemToCart,
  removeCartItemFromCart,
  clearCart,
  getCartByUserId,
} from "../services/cartService";
import { CreateCartItemInput } from "../types";
import { createOrder } from "../services/orderService";
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

export const addCartItemToCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cartId, item } = req.body;

  if (!cartId || !item) {
    res.status(400).json({ error: "Cart ID and item are required" });
    return;
  }

  try {
    const updatedCart = await addCartItemToCart(cartId, item);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Controller: Error adding item to cart:", error);
    res
      .status(500)
      .json({ error: "Controller Error: Failed to add item to cart" });
  }
};

export const removeCartItemFromCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cartId, itemId } = req.body;

  if (!cartId || !itemId) {
    res.status(400).json({ error: "Cart ID and item ID are required" });
    return;
  }

  try {
    const updatedCart = await removeCartItemFromCart(cartId, itemId);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Controller: Error removing item from cart:", error);
    res
      .status(500)
      .json({ error: "Controller Error: Failed to remove item from cart" });
  }
};

export const clearCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    await clearCart(userId);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Controller: Error clearing cart:", error);
    res.status(500).json({ error: "Controller Error: Failed to clear cart" });
  }
};
