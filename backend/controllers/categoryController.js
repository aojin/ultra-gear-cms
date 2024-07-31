// backend/controllers/categoryController.js
const prisma = require("../prisma/prismaClient");

exports.createCategory = async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
