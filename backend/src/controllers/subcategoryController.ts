import { Request, Response } from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../services/subCategoryService";

export const createSubCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, categoryId } = req.body;

  try {
    const subCategory = await createSubCategory(name, description, categoryId);
    res.status(201).json(subCategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllSubCategoriesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subCategories = await getAllSubCategories();
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getSubCategoryByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const subCategory = await getSubCategoryById(parseInt(id, 10));
    if (!subCategory) {
      res.status(404).json({ error: "SubCategory not found" });
      return;
    }
    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateSubCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    const subCategory = await updateSubCategory(
      parseInt(id, 10),
      name,
      description,
      categoryId
    );
    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSubCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await deleteSubCategory(parseInt(id, 10));
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(400).json({ error: error.message });
  }
};
