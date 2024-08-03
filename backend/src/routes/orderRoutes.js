import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  archiveOrder,
  permanentlyDeleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.put("/archive/:id", archiveOrder);
router.delete("/:id", permanentlyDeleteOrder);

export default router;
