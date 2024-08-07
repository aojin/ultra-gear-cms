import express from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  archiveOrderHandler,
  unarchiveOrderHandler,
  permanentlyDeleteOrderHandler,
} from "../controllers/orderController";

const router = express.Router();

router.post("/orders", createOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.put("/:id", updateOrderHandler);
router.put("/archive/:id", archiveOrderHandler);
router.delete("/:id", permanentlyDeleteOrderHandler);
router.put("/unarchive/:id", unarchiveOrderHandler);

export default router;
