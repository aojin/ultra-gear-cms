const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.put("/:id/archive", productController.archiveProduct);
router.put("/:id/unarchive", productController.unarchiveProduct);
router.delete(
  "/products/:id/permanent",
  productController.deleteProductPermanently
);

module.exports = router;
