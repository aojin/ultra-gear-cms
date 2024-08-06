import express from "express";
import {
  createOrderItemHandler,
  getAllOrderItemsHandler,
  getOrderItemByIdHandler,
  getOrderItemsByOrderIdHandler,
  updateOrderItemHandler,
  archiveOrderItemHandler,
  deleteOrderItemHandler,
} from "../controllers/orderItemController";

const router = express.Router();

router.post("/", createOrderItemHandler);
router.get("/", getAllOrderItemsHandler);
router.get("/:id", getOrderItemByIdHandler);
router.get("/order/:orderId", getOrderItemsByOrderIdHandler);
router.put("/:id", updateOrderItemHandler);
router.put("/archive/:id", archiveOrderItemHandler);
router.delete("/:id", deleteOrderItemHandler);

export default router;
