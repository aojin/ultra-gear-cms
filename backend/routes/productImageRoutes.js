// backend/routes/productImageRoutes.js
const express = require("express");
const router = express.Router();
const productImageController = require("../controllers/productImageController");

router.post("/", productImageController.createProductImage);
router.get("/", productImageController.getAllProductImages);
router.put("/:id", productImageController.updateProductImage);
router.delete("/:id", productImageController.deleteProductImage);

module.exports = router;
