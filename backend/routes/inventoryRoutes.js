const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new Inventory
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const inventory = await prisma.inventory.create({
      data: {
        product: { connect: { id: productId } },
        quantity,
      },
    });
    res.status(201).json(inventory);
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all Inventories
router.get("/", async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany();
    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error fetching inventories:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single Inventory
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).json({ error: "Inventory not found" });
    }
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update an Inventory
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const inventory = await prisma.inventory.update({
      where: { id: parseInt(id, 10) },
      data: { quantity },
    });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an Inventory
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.inventory.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
