import express from "express";
import {
  createProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductPermanentlyHandler,
  archiveProductHandler,
  unarchiveProductHandler,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProductHandler);
router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductPermanentlyHandler);
router.post("/:id/archive", archiveProductHandler);
router.post("/:id/unarchive", unarchiveProductHandler);

export default router;
