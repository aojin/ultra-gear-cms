const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createInventory = async (req, res) => {
  try {
    const { quantity, productId } = req.body;

    if (!quantity || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inventory = await prisma.inventory.create({
      data: {
        quantity,
        product: {
          connect: { id: productId },
        },
      },
    });
    res.status(201).json(inventory); // 201 Created
  } catch (error) {
    console.error("Error creating inventory:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany();
    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error fetching inventories:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).json({ error: "Inventory not found" });
    }
  } catch (error) {
    console.error("Error fetching inventory:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    await prisma.inventory.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).end(); // 204 No Content
  } catch (error) {
    console.error("Error deleting inventory:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};
