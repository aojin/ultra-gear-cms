// backend/routes/inventoryRoutes.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/", inventoryController.createInventory);
router.get("/", inventoryController.getAllInventories);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

module.exports = router;
