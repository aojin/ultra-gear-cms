import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProductHandler = async (req, res) => {
  try {
    const { name, description, msrpPrice, currentPrice, brand, model } =
      req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        msrpPrice,
        currentPrice,
        brand,
        model,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the product." });
  }
};

export const getAllProductsHandler = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductByIdHandler = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductPermanentlyHandler = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveProductHandler = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { archived: true },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveProductHandler = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { archived: false },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
