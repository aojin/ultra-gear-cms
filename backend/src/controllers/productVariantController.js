import {
  createProductVariant,
  getAllProductVariants,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant,
  archiveProductVariant,
  unarchiveProductVariant,
} from "../services/productVariantService.js";

export const createProductVariantHandler = async (req, res) => {
  try {
    const productVariant = await createProductVariant(req.body);
    res.status(201).json(productVariant);
  } catch (error) {
    console.error("Error creating product variant:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductVariantsHandler = async (req, res) => {
  try {
    const productVariants = await getAllProductVariants();
    res.status(200).json(productVariants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductVariantByIdHandler = async (req, res) => {
  try {
    const productVariant = await getProductVariantById(req.params.id);
    if (!productVariant) {
      return res.status(404).json({ error: "Product variant not found" });
    }
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductVariantHandler = async (req, res) => {
  try {
    const productVariant = await updateProductVariant(req.params.id, req.body);
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductVariantHandler = async (req, res) => {
  try {
    await deleteProductVariant(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveProductVariantHandler = async (req, res) => {
  try {
    const productVariant = await archiveProductVariant(req.params.id);
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveProductVariantHandler = async (req, res) => {
  try {
    const productVariant = await unarchiveProductVariant(req.params.id);
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
