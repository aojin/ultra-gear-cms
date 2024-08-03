import express from "express";
import {
  createCart,
  getAllCarts,
  updateCart,
  deleteCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.get("/", getAllCarts);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

export default router;
