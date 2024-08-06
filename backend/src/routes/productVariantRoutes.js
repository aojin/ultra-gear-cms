import express from "express";
import {
  createProductVariantHandler,
  getAllProductVariantsHandler,
  getProductVariantByIdHandler,
  updateProductVariantHandler,
  deleteProductVariantHandler,
  archiveProductVariantHandler,
  unarchiveProductVariantHandler,
} from "../controllers/productVariantController";

const router = express.Router();

router.post("/", createProductVariantHandler);
router.get("/", getAllProductVariantsHandler);
router.get("/:id", getProductVariantByIdHandler);
router.put("/:id", updateProductVariantHandler);
router.delete("/:id", deleteProductVariantHandler);
router.post("/:id/archive", archiveProductVariantHandler);
router.post("/:id/unarchive", unarchiveProductVariantHandler);

export default router;
