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
  const {
    name,
    description,
    brand,
    model,
    msrpPrice,
    currentPrice,
    onSale,
    isSingleSize,
    archived,
    quantity,
  } = req.body;

  try {
    // Validate input data
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!brand) missingFields.push("brand");
    if (!model) missingFields.push("model");
    if (msrpPrice === undefined) missingFields.push("msrpPrice");

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Set default value for currentPrice if not provided
    const finalCurrentPrice =
      currentPrice !== undefined ? currentPrice : msrpPrice;

    // Create product
    const newProduct = await createProduct({
      name,
      description,
      brand,
      model,
      msrpPrice,
      currentPrice: finalCurrentPrice,
      isSingleSize,
      quantity,
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Controller: Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
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
    console.error("Controller: Error fetching products:", error);
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
    console.error("Controller: Error fetching product by ID:", error);
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

  // Check if at least one field is provided
  if (
    !name &&
    !description &&
    msrpPrice === undefined &&
    currentPrice === undefined &&
    !brand &&
    !model &&
    archived === undefined &&
    onSale === undefined &&
    isSingleSize === undefined &&
    quantity === undefined
  ) {
    res.status(400).json({ error: "At least one field must be provided" });
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
      isSingleSize,
      quantity,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Controller: Error updating product:", error);
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
    console.error("Controller: Error deleting product permanently:", error);
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
    const product = await getProductById(parseInt(id, 10));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const archivedProduct = await archiveProduct(parseInt(id, 10));
    res.status(200).json(archivedProduct);
  } catch (error) {
    console.error("Controller: Error archiving product:", error);
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
    const product = await getProductById(parseInt(id, 10));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const unarchivedProduct = await unarchiveProduct(parseInt(id, 10));
    res.status(200).json(unarchivedProduct);
  } catch (error) {
    console.error("Controller: Error unarchiving product:", error);
    res.status(500).json({
      error: (error as Error).message,
    });
  }
};
