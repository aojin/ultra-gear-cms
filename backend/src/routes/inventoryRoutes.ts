import express from "express";
import {
  createInventoryHandler,
  getAllInventoriesHandler,
  getInventoryByIdHandler,
  getInventoryByProductIdHandler,
  getInventoryByVariantIdHandler,
  updateInventoryHandler,
  deleteInventoryHandler,
  incrementInventoryHandler,
  decrementInventoryHandler,
} from "../controllers/inventoryController";

const router = express.Router();

router.post("/", createInventoryHandler);
router.get("/", getAllInventoriesHandler);
router.get("/:id", getInventoryByIdHandler);
router.get("/product/:id", getInventoryByProductIdHandler);
router.get("/variant/:id", getInventoryByVariantIdHandler);
router.put("/:id", updateInventoryHandler);
router.delete("/:id", deleteInventoryHandler);
router.post("/increment", incrementInventoryHandler);
router.post("/decrement", decrementInventoryHandler);

export default router;
