import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new Size
export const createSize = async (req, res) => {
  const { size, quantity, productId, variantId } = req.body;

  try {
    const newSize = await prisma.size.create({
      data: { size, quantity, productId, variantId },
    });
    res.status(201).json(newSize);
  } catch (error) {
    console.error("Error creating Size:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all Sizes
export const getAllSizes = async (req, res) => {
  try {
    const sizes = await prisma.size.findMany();
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Sizes by Product ID
export const getSizesByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const sizes = await prisma.size.findMany({
      where: { productId: parseInt(productId, 10) },
    });
    if (sizes.length === 0) {
      return res
        .status(404)
        .json({ error: "No sizes found for the given product ID" });
    }
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes by product ID:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Sizes by Variant ID
export const getSizesByVariantId = async (req, res) => {
  const { variantId } = req.params;

  try {
    const sizes = await prisma.size.findMany({
      where: { variantId: parseInt(variantId, 10) },
    });
    if (sizes.length === 0) {
      return res
        .status(404)
        .json({ error: "No sizes found for the given variant ID" });
    }
    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching Sizes by variant ID:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a Size by ID
export const getSizeById = async (req, res) => {
  const { id } = req.params;

  try {
    const size = await prisma.size.findUnique({
      where: { id: parseInt(id) },
    });
    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }
    res.status(200).json(size);
  } catch (error) {
    console.error("Error fetching Size:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update a Size
export const updateSize = async (req, res) => {
  const { id } = req.params;
  const { size, quantity } = req.body;

  try {
    const updatedSize = await prisma.size.update({
      where: { id: parseInt(id) },
      data: { size, quantity },
    });
    res.status(200).json(updatedSize);
  } catch (error) {
    console.error("Error updating Size:", error);
    res.status(400).json({ error: error.message });
  }
};

// Archive a Size
export const archiveSize = async (req, res) => {
  const { id } = req.params;

  try {
    const archivedSize = await prisma.size.update({
      where: { id: parseInt(id) },
      data: { archived: true },
    });
    res.status(200).json(archivedSize);
  } catch (error) {
    console.error("Error archiving Size:", error);
    res.status(400).json({ error: error.message });
  }
};

// Unarchive a Size
export const unarchiveSize = async (req, res) => {
  const { id } = req.params;

  try {
    const unarchivedSize = await prisma.size.update({
      where: { id: parseInt(id) },
      data: { archived: false },
    });
    res.status(200).json(unarchivedSize);
  } catch (error) {
    console.error("Error unarchiving Size:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a Size
export const deleteSize = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.size.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting Size:", error);
    res.status(400).json({ error: error.message });
  }
};
