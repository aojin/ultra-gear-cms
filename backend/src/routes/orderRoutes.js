import express from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  archiveOrderHandler,
  permanentlyDeleteOrderHandler,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.put("/:id", updateOrderHandler);
router.put("/archive/:id", archiveOrderHandler);
router.delete("/:id", permanentlyDeleteOrderHandler);

export default router;
