const express = require("express");
const router = express.Router();
const productImageController = require("../controllers/productImageController");

router.post("/", productImageController.createProductImage);
router.get("/", productImageController.getAllProductImages);
router.get("/:id", productImageController.getProductImage);
router.get(
  "/product/:productId",
  productImageController.getAllProductImagesByProductId
);
router.get(
  "/variant/:variantId",
  productImageController.getAllProductVariantImagesByVariantId
);
router.put("/:id", productImageController.updateProductImage);
router.put("/:id/archive", productImageController.archiveProductImage);
router.put("/:id/unarchive", productImageController.unarchiveProductImage);
router.delete("/:id", productImageController.deleteProductImage);

module.exports = router;
