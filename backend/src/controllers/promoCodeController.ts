import { Request, Response } from "express";
import {
  createPromoCode,
  getPromoCodeById,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  CreatePromoCodeInput,
  UpdatePromoCodeInput,
} from "../services/promoCodeService";

export const createPromoCodeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, validFrom, validTo, saleId }: CreatePromoCodeInput = req.body;
  try {
    const promoCode = await createPromoCode({
      code,
      validFrom,
      validTo,
      saleId,
    });
    res.status(201).json(promoCode);
  } catch (error) {
    console.error("Error creating PromoCode:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getPromoCodeByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const promoCode = await getPromoCodeById(parseInt(id, 10));

    if (!promoCode) {
      res.status(404).json({ error: "PromoCode not found" });
      return;
    }

    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Error retrieving PromoCode:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPromoCodesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const promoCodes = await getAllPromoCodes();
    res.json(promoCodes);
  } catch (error) {
    console.error("Error fetching PromoCodes:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updatePromoCodeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { code, validFrom, validTo }: UpdatePromoCodeInput = req.body;
  try {
    const promoCode = await updatePromoCode(parseInt(id, 10), {
      code,
      validFrom,
      validTo,
    });
    res.json(promoCode);
  } catch (error) {
    console.error("Error updating PromoCode:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deletePromoCodeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deletePromoCode(parseInt(id, 10));
    res.status(204).json({ message: "PromoCode deleted successfully" });
  } catch (error) {
    console.error("Error deleting PromoCode:", error);
    res.status(500).json({ error: error.message });
  }
};
