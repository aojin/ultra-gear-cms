import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { Request, Response } from "express";

export const createCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const category = await createCategory({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error("Service: Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllCategoriesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Service: Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await getCategoryById(parseInt(req.params.id, 10));
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Service: Error fetching category by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const category = await updateCategory(parseInt(id, 10), {
      name,
      description,
    });
    res.status(200).json(category);
  } catch (error) {
    console.error("Service: Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteCategory(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    console.error("Service: Error deleting category:", error);
    res.status(500).json({ error: error.message });
  }
};
