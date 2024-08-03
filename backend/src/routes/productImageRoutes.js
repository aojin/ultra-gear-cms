import express from "express";
import {
  createProductImage,
  getAllProductImages,
  getProductImage,
  getAllProductImagesByProductId,
  getAllProductVariantImagesByVariantId,
  updateProductImage,
  archiveProductImage,
  unarchiveProductImage,
  deleteProductImage,
} from "../controllers/productImageController.js";

const router = express.Router();

router.post("/", createProductImage);
router.get("/", getAllProductImages);
router.get("/:id", getProductImage);
router.get("/product/:productId", getAllProductImagesByProductId);
router.get("/variant/:variantId", getAllProductVariantImagesByVariantId);
router.put("/:id", updateProductImage);
router.put("/archive/:id", archiveProductImage);
router.put("/unarchive/:id", unarchiveProductImage);
router.delete("/:id", deleteProductImage);

export default router;
