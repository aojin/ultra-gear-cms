import express from "express";
import {
  createCartHandler,
  getAllCartsHandler,
  deleteCartHandler,
  addCartItemToCartHandler,
  removeCartItemFromCartHandler,
  clearCartHandler,
} from "../controllers/cartController";

const router = express.Router();

router.post("/", createCartHandler);
router.get("/", getAllCartsHandler);
router.delete("/:id", deleteCartHandler);
router.post("/add-item", addCartItemToCartHandler);
router.post("/remove-item", removeCartItemFromCartHandler);
router.post("/clear", clearCartHandler);

export default router;
