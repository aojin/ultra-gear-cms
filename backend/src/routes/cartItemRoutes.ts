import express from "express";
import {
  createCartItemHandler,
  getAllCartItemsHandler,
  updateCartItemHandler,
  deleteCartItemHandler,
} from "../controllers/cartItemController";

const router = express.Router();

router.post("/", createCartItemHandler);
router.get("/", getAllCartItemsHandler);
router.put("/:id", updateCartItemHandler);
router.delete("/:id", deleteCartItemHandler);

export default router;
