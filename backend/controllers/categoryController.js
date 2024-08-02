const prisma = require("../prisma/prismaClient");

// Create a new Category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await prisma.category.create({
      data: { name, description },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update a Category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { newCategoryId } = req.body;

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { products: true, subcategories: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.products.length > 0) {
      if (!newCategoryId) {
        return res.status(400).json({
          error: "New category ID is required to reassign products",
        });
      }

      await prisma.$transaction(async (tx) => {
        for (const product of category.products) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              categories: {
                disconnect: { id: category.id },
                connect: { id: parseInt(newCategoryId) },
              },
              subcategories: {
                disconnect: category.subcategories.map((sub) => ({
                  id: sub.id,
                })),
              },
            },
          });
        }

        await tx.category.delete({
          where: { id: category.id },
        });
      });
    } else {
      await prisma.category.delete({
        where: { id: category.id },
      });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(400).json({ error: error.message });
  }
};
