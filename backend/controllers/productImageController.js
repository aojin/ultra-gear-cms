// backend/controllers/productImageController.js
const prisma = require("../prisma/prismaClient");

exports.createProductImage = async (req, res) => {
  try {
    const productImage = await prisma.productImage.create({ data: req.body });
    res.json(productImage);
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

exports.deleteProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    const productImage = await prisma.productImage.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
