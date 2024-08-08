import express, { RequestHandler } from "express";
import {
  createSaleHandler,
  getAllSalesHandler,
  getSaleByIdHandler,
  updateSaleHandler,
  deleteSaleHandler,
  archiveSaleHandler,
  unarchiveSaleHandler,
} from "../controllers/saleController";

const router = express.Router();

router.post("/", createSaleHandler as RequestHandler);
router.get("/", getAllSalesHandler as RequestHandler);
router.get("/:id", getSaleByIdHandler as RequestHandler);
router.put("/:id", updateSaleHandler as RequestHandler);
router.delete("/:id", deleteSaleHandler as RequestHandler);
router.put("/archive/:id", archiveSaleHandler as RequestHandler);
router.put("/unarchive/:id", unarchiveSaleHandler as RequestHandler);

export default router;
