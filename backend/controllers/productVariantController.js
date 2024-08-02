const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProductVariant = async (req, res) => {
  try {
    const productVariant = await prisma.productVariant.create({
      data: req.body,
    });
    res.status(201).json(productVariant); // Changed status code to 201
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductVariants = async (req, res) => {
  try {
    const productVariants = await prisma.productVariant.findMany();
    res.status(200).json(productVariants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductVariantById = async (req, res) => {
  try {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (productVariant) {
      res.status(200).json(productVariant);
    } else {
      res.status(404).json({ error: "ProductVariant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductVariant = async (req, res) => {
  try {
    const productVariant = await prisma.productVariant.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productVariant.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting product variant:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.archiveProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.productVariant.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });

    // Archive related ProductImages and Sizes
    await prisma.productImage.updateMany({
      where: { productVariantId: productVariant.id },
      data: { archived: true },
    });

    await prisma.size.updateMany({
      where: { variantId: productVariant.id },
      data: { archived: true },
    });

    res.status(200).json(productVariant);
  } catch (error) {
    console.error("Error archiving product variant:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.unarchiveProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    const productVariant = await prisma.productVariant.update({
      where: { id: parseInt(id, 10) },
      data: { archived: false },
    });

    // Unarchive related ProductImages and Sizes
    await prisma.productImage.updateMany({
      where: { productVariantId: productVariant.id },
      data: { archived: false },
    });

    await prisma.size.updateMany({
      where: { variantId: productVariant.id },
      data: { archived: false },
    });

    res.status(200).json(productVariant);
  } catch (error) {
    console.error("Error unarchiving product variant:", error);
    res.status(500).json({ error: error.message });
  }
};
