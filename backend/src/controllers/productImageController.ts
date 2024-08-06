import { Request, Response } from "express";
import {
  createProductImage,
  getAllProductImages,
  getProductImageById,
  getAllProductImagesByProductId,
  getAllProductVariantImagesByVariantId,
  updateProductImage,
  archiveProductImage,
  unarchiveProductImage,
  deleteProductImage,
  CreateProductImageInput,
  UpdateProductImageInput,
} from "../services/productImageService";

export const createProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { url, order, productId, productVariantId }: CreateProductImageInput =
    req.body;

  if (!url || order === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const productImage = await createProductImage({
      url,
      order,
      productId,
      productVariantId,
    });
    res.status(201).json(productImage);
  } catch (error) {
    console.error("Controller: Error creating product image:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllProductImagesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productImages = await getAllProductImages();
    res.status(200).json(productImages);
  } catch (error) {
    console.error("Controller: Error fetching product images:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productImage = await getProductImageById(parseInt(req.params.id, 10));
    if (!productImage) {
      res.status(404).json({ error: "Product image not found" });
      return;
    }
    res.status(200).json(productImage);
  } catch (error) {
    console.error("Controller: Error fetching product image by ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllProductImagesByProductIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productImages = await getAllProductImagesByProductId(
      parseInt(req.params.productId, 10)
    );
    res.status(200).json(productImages);
  } catch (error) {
    console.error(
      "Controller: Error fetching product images by product ID:",
      error
    );
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllProductVariantImagesByVariantIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productVariantImages = await getAllProductVariantImagesByVariantId(
      parseInt(req.params.variantId, 10)
    );
    res.status(200).json(productVariantImages);
  } catch (error) {
    console.error(
      "Controller: Error fetching product images by variant ID:",
      error
    );
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { url, order, productId, productVariantId }: UpdateProductImageInput =
    req.body;

  if (!url || order === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const productImage = await updateProductImage(parseInt(req.params.id, 10), {
      url,
      order,
      productId,
      productVariantId,
    });
    res.status(200).json(productImage);
  } catch (error) {
    console.error("Controller: Error updating product image:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const archiveProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productImage = await archiveProductImage(parseInt(req.params.id, 10));
    res.status(200).json(productImage);
  } catch (error) {
    console.error("Controller: Error archiving product image:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const unarchiveProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productImage = await unarchiveProductImage(
      parseInt(req.params.id, 10)
    );
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProductImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteProductImage(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
