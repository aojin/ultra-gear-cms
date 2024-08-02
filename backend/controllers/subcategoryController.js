const prisma = require("../prisma/prismaClient");

// Create a new SubCategory
exports.createSubCategory = async (req, res) => {
  const { name, description, categoryId } = req.body;

  try {
    const subCategory = await prisma.subCategory.create({
      data: { name, description, categoryId },
    });
    res.status(201).json(subCategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all SubCategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await prisma.subCategory.findMany();
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: parseInt(id) },
    });
    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update a SubCategory
exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    const subCategory = await prisma.subCategory.update({
      where: { id: parseInt(id) },
      data: { name, description, categoryId },
    });
    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a SubCategory
exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: parseInt(id) },
      include: { products: true },
    });

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    await prisma.$transaction(async (tx) => {
      for (const product of subCategory.products) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            subcategories: {
              disconnect: { id: subCategory.id },
            },
          },
        });
      }

      await tx.subCategory.delete({
        where: { id: subCategory.id },
      });
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};
