import express from "express";
import {
  createInventoryHandler,
  getAllInventoriesHandler,
  getInventoryByIdHandler,
  updateInventoryHandler,
  deleteInventoryHandler,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createInventoryHandler);
router.get("/", getAllInventoriesHandler);
router.get("/:id", getInventoryByIdHandler);
router.put("/:id", updateInventoryHandler);
router.delete("/:id", deleteInventoryHandler);

export default router;
