const prisma = require("../prisma/prismaClient");

// Create a new Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, msrpPrice, currentPrice, brand, model } =
      req.body;

    // Validate input
    if (!name || !msrpPrice || !currentPrice || !brand || !model) {
      return res.status(400).json({
        error: "Name, msrpPrice, currentPrice, brand, and model are required",
      });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description, // Optional field
        msrpPrice,
        currentPrice,
        brand,
        model,
        // Other fields will be handled by defaults or relationships
      },
    });

    res.status(201).json(product); // Ensure 201 status code for creation
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductPermanently = async (req, res) => {
  const { id } = req.params;
  try {
    // product variants should be deleted automatically by cascading deletion
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.archiveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });

    // Archive related ProductVariants, ProductImages, and Sizes
    await prisma.productVariant.updateMany({
      where: { productId: product.id },
      data: { archived: true },
    });

    await prisma.productImage.updateMany({
      where: { productId: product.id },
      data: { archived: true },
    });

    await prisma.size.updateMany({
      where: { productId: product.id },
      data: { archived: true },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error archiving product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.unarchiveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { archived: false },
    });

    // Unarchive related ProductVariants, ProductImages, and Sizes
    await prisma.productVariant.updateMany({
      where: { productId: product.id },
      data: { archived: false },
    });

    await prisma.productImage.updateMany({
      where: { productId: product.id },
      data: { archived: false },
    });

    await prisma.size.updateMany({
      where: { productId: product.id },
      data: { archived: false },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error unarchiving product:", error);
    res.status(500).json({ error: error.message });
  }
};
