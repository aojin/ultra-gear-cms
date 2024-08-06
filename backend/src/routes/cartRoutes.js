import express from "express";
import {
  createCartHandler,
  getAllCartsHandler,
  updateCartHandler,
  deleteCartHandler,
} from "../controllers/cartController";

const router = express.Router();

router.post("/", createCartHandler);
router.get("/", getAllCartsHandler);
router.put("/:id", updateCartHandler);
router.delete("/:id", deleteCartHandler);

export default router;
