const prisma = require("../prisma/prismaClient");

exports.createProductVariant = async (req, res) => {
  try {
    const productVariant = await prisma.productVariant.create({
      data: req.body,
    });
    res.json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductVariants = async (req, res) => {
  try {
    const productVariants = await prisma.productVariant.findMany();
    res.json(productVariants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductVariantById = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!productVariant) {
      return res.status(404).json({ error: "Product Variant not found" });
    }
    res.json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.productVariant.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.productVariant.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
