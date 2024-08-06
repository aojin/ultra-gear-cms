import { Request, Response } from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  CreatePackageInput,
  UpdatePackageInput,
} from "../services/packageService";

export const createPackageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, products }: CreatePackageInput = req.body;

  if (!name || !price || !products) {
    res.status(400).json({ error: "Name, price, and products are required" });
    return;
  }

  try {
    const newPackage = await createPackage({
      name,
      description,
      price,
      products,
    });
    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Controller: Error creating package:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllPackagesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const packages = await getAllPackages();
    res.status(200).json(packages);
  } catch (error) {
    console.error("Controller: Error fetching packages:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getPackageByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const packageItem = await getPackageById(parseInt(req.params.id, 10));
    if (packageItem) {
      res.status(200).json(packageItem);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error("Controller: Error fetching package by ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updatePackageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, products }: UpdatePackageInput = req.body;

  if (!name || !price || !products) {
    res.status(400).json({ error: "Name, price, and products are required" });
    return;
  }

  try {
    const updatedPackage = await updatePackage(parseInt(id, 10), {
      name,
      description,
      price,
      products,
    });
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Controller: Error updating package:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deletePackageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deletePackage(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    console.error("Controller: Error deleting package:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
