import express from "express";
import {
  createSubCategoryHandler,
  getAllSubCategoriesHandler,
  getSubCategoryByIdHandler,
  updateSubCategoryHandler,
  deleteSubCategoryHandler,
} from "../controllers/subcategoryController.js";

const router = express.Router();

router.post("/", createSubCategoryHandler);
router.get("/", getAllSubCategoriesHandler);
router.get("/:id", getSubCategoryByIdHandler);
router.put("/:id", updateSubCategoryHandler);
router.delete("/:id", deleteSubCategoryHandler);

export default router;
