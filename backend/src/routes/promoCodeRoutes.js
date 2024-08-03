import express from "express";
import {
  createPromoCode,
  getPromoCodeById,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
} from "../controllers/promoCodeController.js";

const router = express.Router();

router.post("/", createPromoCode);
router.get("/", getAllPromoCodes);
router.get("/:id", getPromoCodeById);
router.put("/:id", updatePromoCode);
router.delete("/:id", deletePromoCode);

export default router;
