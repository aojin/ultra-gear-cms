import { Request, Response } from "express";
import {
  createCart,
  getAllCarts,
  updateCart,
  deleteCart,
  CartItemInput,
} from "../services/cartService";

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

    const cart = await createCart(userId, items as CartItemInput[]);
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
    const cart = await updateCart(parseInt(id, 10), items as CartItemInput[]);
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
