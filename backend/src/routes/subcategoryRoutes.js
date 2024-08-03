import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subcategoryController.js";

const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
