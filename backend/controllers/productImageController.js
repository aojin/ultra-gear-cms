const prisma = require("../prisma/prismaClient");

exports.createProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.create({
      data: req.body,
    });
    res.status(201).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const productImage = await prisma.productImage.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!productImage) {
      return res.status(404).json({ error: "ProductImage not found" });
    }
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductImages = async (req, res) => {
  try {
    const productImages = await prisma.productImage.findMany();
    res.json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductImagesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const productImages = await prisma.productImage.findMany({
      where: { productId: parseInt(productId, 10) },
    });
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductVariantImagesByVariantId = async (req, res) => {
  const { variantId } = req.params;
  try {
    const productImages = await prisma.productImage.findMany({
      where: { productVariantId: parseInt(variantId, 10) },
    });
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unarchiveProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const productImage = await prisma.productImage.update({
      where: { id: parseInt(id, 10) },
      data: { archived: false },
    });
    res.status(200).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productImage.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
