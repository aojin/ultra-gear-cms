import express from "express";
import {
  createSaleHandler,
  getAllSalesHandler,
  getSaleByIdHandler,
  updateSaleHandler,
  deleteSaleHandler,
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/", createSaleHandler);
router.get("/", getAllSalesHandler);
router.get("/:id", getSaleByIdHandler);
router.put("/:id", updateSaleHandler);
router.delete("/:id", deleteSaleHandler);

export default router;
