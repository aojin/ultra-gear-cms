import express from "express";
import {
  createPromoCodeHandler,
  getPromoCodeByIdHandler,
  getAllPromoCodesHandler,
  updatePromoCodeHandler,
  deletePromoCodeHandler,
} from "../controllers/promoCodeController.js";

const router = express.Router();

router.post("/", createPromoCodeHandler);
router.get("/", getAllPromoCodesHandler);
router.get("/:id", getPromoCodeByIdHandler);
router.put("/:id", updatePromoCodeHandler);
router.delete("/:id", deletePromoCodeHandler);

export default router;
