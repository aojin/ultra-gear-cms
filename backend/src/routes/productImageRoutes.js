import express from "express";
import {
  createProductImageHandler,
  getAllProductImagesHandler,
  getProductImageHandler,
  getAllProductImagesByProductIdHandler,
  getAllProductVariantImagesByVariantIdHandler,
  updateProductImageHandler,
  archiveProductImageHandler,
  unarchiveProductImageHandler,
  deleteProductImageHandler,
} from "../controllers/productImageController.js";

const router = express.Router();

router.post("/", createProductImageHandler);
router.get("/", getAllProductImagesHandler);
router.get("/:id", getProductImageHandler);
router.get("/product/:productId", getAllProductImagesByProductIdHandler);
router.get("/variant/:variantId", getAllProductVariantImagesByVariantIdHandler);
router.put("/:id", updateProductImageHandler);
router.put("/archive/:id", archiveProductImageHandler);
router.put("/unarchive/:id", unarchiveProductImageHandler);
router.delete("/:id", deleteProductImageHandler);

export default router;
