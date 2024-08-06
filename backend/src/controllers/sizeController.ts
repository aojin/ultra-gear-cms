import { Request, Response } from "express";
import {
  createSize,
  getAllSizes,
  getSizesByProductId,
  getSizesByVariantId,
  getSizeById,
  updateSize,
  archiveSize,
  unarchiveSize,
  deleteSize,
  CreateSizeInput,
  UpdateSizeInput,
} from "../services/sizeService";

export const createSizeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { size, quantity, productId, variantId }: CreateSizeInput = req.body;

  try {
    const newSize = await createSize({ size, quantity, productId, variantId });
    res.status(201).json(newSize);
  } catch (error) {
    console.error("Error creating Size:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllSizesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sizes = await getAllSizes();
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getSizesByProductIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId } = req.params;

  try {
    const sizes = await getSizesByProductId(parseInt(productId, 10));
    if (sizes.length === 0) {
      res
        .status(404)
        .json({ error: "No sizes found for the given product ID" });
      return;
    }
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes by product ID:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getSizesByVariantIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { variantId } = req.params;

  try {
    const sizes = await getSizesByVariantId(parseInt(variantId, 10));
    if (sizes.length === 0) {
      res
        .status(404)
        .json({ error: "No sizes found for the given variant ID" });
      return;
    }
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes by variant ID:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getSizeByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const size = await getSizeById(parseInt(id, 10));
    if (!size) {
      res.status(404).json({ error: "Size not found" });
      return;
    }
    res.status(200).json(size);
  } catch (error) {
    console.error("Error fetching Size:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateSizeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { size, quantity }: UpdateSizeInput = req.body;

  try {
    const updatedSize = await updateSize(parseInt(id, 10), {
      size,
      quantity,
    });
    res.status(200).json(updatedSize);
  } catch (error) {
    console.error("Error updating Size:", error);
    res.status(400).json({ error: error.message });
  }
};

export const archiveSizeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const archivedSize = await archiveSize(parseInt(id, 10));
    res.status(200).json(archivedSize);
  } catch (error) {
    console.error("Error archiving Size:", error);
    res.status(400).json({ error: error.message });
  }
};

export const unarchiveSizeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const unarchivedSize = await unarchiveSize(parseInt(id, 10));
    res.status(200).json(unarchivedSize);
  } catch (error) {
    console.error("Error unarchiving Size:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSizeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await deleteSize(parseInt(id, 10));
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting Size:", error);
    res.status(400).json({ error: error.message });
  }
};
