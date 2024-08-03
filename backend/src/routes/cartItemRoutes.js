import express from "express";
import {
  createCartItem,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartItemController.js";

const router = express.Router();

router.post("/", createCartItem);
router.get("/", getAllCartItems);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router;
