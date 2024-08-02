const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Create a new Category
router.post("/", categoryController.createCategory);

// Get all Categories
router.get("/", categoryController.getAllCategories);

// Get a Category by ID
router.get("/:id", categoryController.getCategoryById);

// Update a Category
router.put("/:id", categoryController.updateCategory);

// Delete a Category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
