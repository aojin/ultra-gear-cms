const express = require("express");
const router = express.Router();
const sizeController = require("../controllers/sizeController");

// Create a new Size
router.post("/", sizeController.createSize);

// Get all Sizes
router.get("/", sizeController.getAllSizes);

// Get Sizes by Product ID
router.get("/product/:productId", sizeController.getSizesByProductId);

// Get Sizes by Variant ID
router.get("/variant/:variantId", sizeController.getSizesByVariantId);

// Get a Size by ID
router.get("/:id", sizeController.getSizeById);

// Update a Size
router.put("/:id", sizeController.updateSize);

// Archive a Size
router.put("/:id/archive", sizeController.archiveSize);

// Unarchive a Size
router.put("/:id/unarchive", sizeController.unarchiveSize);

// Delete a Size
router.delete("/:id", sizeController.deleteSize);

module.exports = router;
