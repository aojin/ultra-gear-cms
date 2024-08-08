import { Request, Response } from "express";
import {
  createCartItem,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
} from "../services/cartItemService";
import { CreateCartItemInput } from "../types";

export const createCartItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    cartId,
    productId,
    variantId,
    sizeId,
    cartQuantity,
    currentPrice,
  }: CreateCartItemInput = req.body;

  if (
    !cartId ||
    !productId ||
    cartQuantity === undefined ||
    currentPrice === undefined
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const cartItem = await createCartItem({
      cartId,
      productId,
      variantId,
      sizeId,
      cartQuantity,
      currentPrice,
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "An error occurred creating a cart item" });
  }
};

export const getAllCartItemsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cartItems = await getAllCartItems();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "An error occurred fetching cart items" });
  }
};

export const updateCartItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    cartId,
    productId,
    variantId,
    sizeId,
    cartQuantity,
    currentPrice,
  }: CreateCartItemInput = req.body;

  if (
    !cartId ||
    !productId ||
    cartQuantity === undefined ||
    currentPrice === undefined
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const cartItem = await updateCartItem(parseInt(id, 10), {
      cartId,
      productId,
      variantId,
      sizeId,
      cartQuantity,
      currentPrice,
    });
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "An error occurred updating cart item" });
  }
};

export const deleteCartItemHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await deleteCartItem(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "An error occurred deleting cart item" });
  }
};
