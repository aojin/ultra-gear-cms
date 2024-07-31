const express = require("express");
const router = express.Router();
const productVariantController = require("../controllers/productVariantController");

router.post("/", productVariantController.createProductVariant);
router.get("/", productVariantController.getAllProductVariants);
router.get("/:id", productVariantController.getProductVariantById);
router.put("/:id", productVariantController.updateProductVariant);
router.delete("/:id", productVariantController.deleteProductVariant);

module.exports = router;
