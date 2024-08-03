import express from "express";
import {
  createSize,
  getAllSizes,
  getSizesByProductId,
  getSizesByVariantId,
  getSizeById,
  updateSize,
  archiveSize,
  unarchiveSize,
  deleteSize,
} from "../controllers/sizeController.js";

const router = express.Router();

router.post("/", createSize);
router.get("/", getAllSizes);
router.get("/product/:productId", getSizesByProductId);
router.get("/variant/:variantId", getSizesByVariantId);
router.get("/:id", getSizeById);
router.put("/:id", updateSize);
router.post("/:id/archive", archiveSize);
router.post("/:id/unarchive", unarchiveSize);
router.delete("/:id", deleteSize);

export default router;
