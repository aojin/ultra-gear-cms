import express from "express";
import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  updateOrderItem,
  archiveOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/", createOrderItem);
router.get("/", getAllOrderItems);
router.get("/:id", getOrderItemById);
router.get("/order/:orderId", getOrderItemsByOrderId);
router.put("/:id", updateOrderItem);
router.put("/archive/:id", archiveOrderItem);
router.delete("/:id", deleteOrderItem);

export default router;
