import { Request, Response } from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  archiveSale,
  unarchiveSale,
} from "../services/saleService";
import { CreateSaleInput, UpdateSaleInput } from "../types";

export const createSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      title,
      tagline,
      startDate,
      endDate,
      salePercentage,
      saleAmount,
      archived,
      products,
      variants,
      promoCodes,
    }: CreateSaleInput = req.body;

    const sale = await createSale({
      name,
      title,
      tagline,
      startDate,
      endDate,
      salePercentage,
      saleAmount,
      archived,
      products,
      variants,
      promoCodes,
    });
    res.status(201).json(sale);
  } catch (error) {
    console.error("Controller Error: Creating sale:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the sale." });
  }
};

export const getAllSalesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sales = await getAllSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Controller Error: Fetching all sales:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching all sales." });
  }
};

export const getSaleByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale = await getSaleById(parseInt(req.params.id, 10));
    if (sale) {
      res.status(200).json(sale);
    } else {
      res.status(404).json({ error: "Sale not found" });
    }
  } catch (error: any) {
    console.error("Controller Error: Fetching sale by ID:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while fetching the sale by ID.",
    });
  }
};

export const updateSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      title,
      tagline,
      startDate,
      endDate,
      salePercentage,
      saleAmount,
      archived,
      products,
      variants,
      promoCodes,
    }: UpdateSaleInput = req.body;

    const sale = await updateSale(parseInt(req.params.id, 10), {
      name,
      title,
      tagline,
      startDate,
      endDate,
      salePercentage,
      saleAmount,
      archived,
      products,
      variants,
      promoCodes,
    });
    res.status(200).json(sale);
  } catch (error: any) {
    console.error("Controller Error: Updating sale:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while updating the sale.",
    });
  }
};

export const deleteSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteSale(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (error: any) {
    console.error("Controller Error: Deleting sale:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while deleting the sale.",
    });
  }
};

export const archiveSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale = await archiveSale(parseInt(req.params.id, 10));
    res.status(200).json(sale);
  } catch (error: any) {
    console.error("Controller Error: Archiving sale:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while archiving the sale.",
    });
  }
};

export const unarchiveSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale = await unarchiveSale(parseInt(req.params.id, 10));
    res.status(200).json(sale);
  } catch (error: any) {
    console.error("Controller Error: Unarchiving sale:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while unarchiving the sale.",
    });
  }
};
