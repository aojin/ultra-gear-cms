import express from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  permanentlyDeleteOrderHandler,
  archiveOrderHandler,
  unarchiveOrderHandler,
  createOrderFromCartHandler,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.put("/:id", updateOrderHandler);
router.delete("/:id", permanentlyDeleteOrderHandler);
router.put("/archive/:id", archiveOrderHandler);
router.put("/unarchive/:id", unarchiveOrderHandler);
router.post("/from-cart", createOrderFromCartHandler);

export default router;
