// backend/controllers/inventoryController.js
const prisma = require("../prisma/prismaClient");

exports.createInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.create({ data: req.body });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany();
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
