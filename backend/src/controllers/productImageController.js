import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.create({
      data: req.body,
    });
    res.status(201).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductImages = async (req, res) => {
  try {
    const productImages = await prisma.productImage.findMany();
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!productImage) {
      return res.status(404).json({ error: "Product image not found" });
    }
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductImagesByProductId = async (req, res) => {
  try {
    const productImages = await prisma.productImage.findMany({
      where: { productId: parseInt(req.params.productId, 10) },
    });
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductVariantImagesByVariantId = async (req, res) => {
  try {
    const productVariantImages = await prisma.productImage.findMany({
      where: { variantId: parseInt(req.params.variantId, 10) },
    });
    res.status(200).json(productVariantImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { archived: true },
    });
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { archived: false },
    });
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    await prisma.productImage.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
