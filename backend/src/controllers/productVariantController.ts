import {
  createProductVariant,
  getAllProductVariants,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant,
  archiveProductVariant,
  unarchiveProductVariant,
} from "../services/productVariantService";
import { Request, Response } from "express";

interface CreateProductVariantInput {
  name: string;
  msrpPrice: number;
  currentPrice: number;
  productId: number;
  isSingleSize: boolean;
  quantity?: number | null;
  archived?: boolean;
}

export const createProductVariantHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    msrpPrice,
    currentPrice,
    productId,
    isSingleSize,
    quantity = null,
    archived = false,
  }: CreateProductVariantInput = req.body;

  if (
    !name ||
    msrpPrice === undefined ||
    currentPrice === undefined ||
    !productId
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const productVariant = await createProductVariant({
      name,
      msrpPrice,
      currentPrice,
      productId,
      isSingleSize,
      quantity,
      archived,
    });
    res.status(201).json(productVariant);
  } catch (error) {
    console.error("Controller Error: creating product variant:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductVariantsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productVariants = await getAllProductVariants();
    res.status(200).json(productVariants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductVariantByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productVariant = await getProductVariantById(
      parseInt(req.params.id, 10)
    );
    if (!productVariant) {
      res
        .status(404)
        .json({ error: "Controller Error: Product variant not found" });
      return;
    }
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductVariantHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    msrpPrice,
    currentPrice,
    isSingleSize,
    quantity = null,
    archived = false,
  } = req.body;

  if (!name || msrpPrice === undefined || currentPrice === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const productVariant = await updateProductVariant(
      parseInt(req.params.id, 10),
      {
        name,
        msrpPrice,
        currentPrice,
        isSingleSize,
        quantity,
        archived,
      }
    );
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductVariantHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteProductVariant(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveProductVariantHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productVariant = await archiveProductVariant(
      parseInt(req.params.id, 10)
    );
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveProductVariantHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productVariant = await unarchiveProductVariant(
      parseInt(req.params.id, 10)
    );
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
