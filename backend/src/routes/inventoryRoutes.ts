import express from "express";
import {
  createInventoryHandler,
  getAllInventoriesHandler,
  getInventoryByIdHandler,
  getInventoryByProductIdHandler,
  getInventoryByVariantIdHandler,
  deleteInventoryHandler,
  updateInventoryHandler,
} from "../controllers/inventoryController";

const router = express.Router();

router.post("/", createInventoryHandler);
router.get("/", getAllInventoriesHandler);
router.get("/:id", getInventoryByIdHandler);
router.get("/product/:id", getInventoryByProductIdHandler);
router.get("/variant/:id", getInventoryByVariantIdHandler);
router.delete("/:id", deleteInventoryHandler);
router.post("/:id/update", updateInventoryHandler);

export default router;
