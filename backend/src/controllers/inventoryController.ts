import {
  createInventory,
  getAllInventories,
  getInventoryById,
  getInventoryByProductId,
  getInventoryByVariantId,
  updateInventory,
  deleteInventory,
  incrementInventory,
  decrementInventory,
} from "../services/inventoryService";
import { Request, Response } from "express";

export const createInventoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId, variantId, sizeId, quantity } = req.body;

  if (quantity === undefined) {
    res.status(400).json({ error: "Quantity is required" });
    return;
  }

  try {
    const inventory = await createInventory({
      productId,
      variantId,
      sizeId,
      quantity,
    });
    res.status(201).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error creating inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllInventoriesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const inventories = await getAllInventories();
    res.status(200).json(inventories);
  } catch (error: any) {
    console.error("Controller: Error fetching inventories:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const inventory = await getInventoryById(parseInt(req.params.id, 10));
    if (!inventory) {
      res.status(404).json({ error: "Inventory not found" });
      return;
    }
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error fetching inventory by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryByProductIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const inventory = await getInventoryByProductId(
      parseInt(req.params.id, 10)
    );
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error fetching inventory by product ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryByVariantIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const inventory = await getInventoryByVariantId(
      parseInt(req.params.id, 10)
    );
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error fetching inventory by variant ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateInventoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { productId, variantId, sizeId, quantity } = req.body;

  if (quantity === undefined) {
    res.status(400).json({ error: "Quantity is required" });
    return;
  }

  try {
    const inventory = await updateInventory(parseInt(id, 10), {
      productId,
      variantId,
      sizeId,
      quantity,
    });
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error updating inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteInventoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteInventory(parseInt(id, 10));
    res.status(204).send();
  } catch (error: any) {
    console.error("Controller: Error deleting inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

export const incrementInventoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, amount } = req.body;

  try {
    const inventory = await incrementInventory(id, amount);
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error incrementing inventory:", error);
    res.status(500).json({ error: error.message });
  }
};

export const decrementInventoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, amount } = req.body;

  try {
    const inventory = await decrementInventory(id, amount);
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error("Controller: Error decrementing inventory:", error);
    res.status(500).json({ error: error.message });
  }
};
