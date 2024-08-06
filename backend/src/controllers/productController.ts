import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductPermanently,
  archiveProduct,
  unarchiveProduct,
} from "../services/productService";

export const createProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, msrpPrice, currentPrice, brand, model } = req.body;

  if (!name || !description || !msrpPrice || !brand || !model) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const newProduct = await createProduct({
      name,
      description,
      msrpPrice,
      currentPrice: currentPrice || 0.0, // Default value if not provided
      brand,
      model,
      onSale: false,
      archived: false,
      isSingleSize: false,
      quantity: 0,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Controller error: Error creating product:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const getAllProductsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Controller error: Error getting all products:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const getProductByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await getProductById(parseInt(req.params.id, 10));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Controller error: Error getting product by ID:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const updateProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    name,
    description,
    msrpPrice,
    currentPrice,
    brand,
    model,
    archived,
    onSale,
    isSingleSize,
    quantity,
  } = req.body;

  if (!name || !description || !msrpPrice || !brand || !model) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const product = await updateProduct(parseInt(id, 10), {
      name,
      description,
      msrpPrice,
      currentPrice,
      brand,
      model,
      archived,
      onSale,
      isSingleSize,
      quantity,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Controller error: Error updating product:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const deleteProductPermanentlyHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteProductPermanently(parseInt(id, 10));
    res.status(204).end();
  } catch (error) {
    console.error(
      "Controller error: Error deleting product permanently:",
      error
    );
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const archiveProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await archiveProduct(parseInt(id, 10));
    res.status(200).json(product);
  } catch (error) {
    console.error("Controller error: Error archiving product:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};

export const unarchiveProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await unarchiveProduct(parseInt(id, 10));
    res.status(200).json(product);
  } catch (error) {
    console.error("Controller error: Error unarchiving product:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};
