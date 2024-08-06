import { Request, Response } from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  archiveSale,
  unarchiveSale,
  CreateSaleInput,
  UpdateSaleInput,
} from "../services/saleService";

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteSale(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale = await archiveSale(parseInt(req.params.id, 10));
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveSaleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale = await unarchiveSale(parseInt(req.params.id, 10));
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
