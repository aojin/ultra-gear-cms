import { Request, Response } from "express";
import {
  createPromoCode,
  getPromoCodeById,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
} from "../services/promoCodeService";
import { CreatePromoCodeInput, UpdatePromoCodeInput } from "../types";

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
    console.error("Controller Error: Creating promo code:", error);
    res.status(400).json({ error: (error as Error).message });
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
      res.status(404).json({ error: "Promo code not found" });
      return;
    }

    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Controller Error: Retrieving promo code by ID:", error);
    if ((error as Error).message === "NotFound") {
      res.status(404).json({ error: "Promo code not found" });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};

export const getAllPromoCodesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const promoCodes = await getAllPromoCodes();
    res.status(200).json(promoCodes);
  } catch (error) {
    console.error("Controller Error: Fetching promo codes:", error);
    res.status(500).json({ error: (error as Error).message });
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
    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Controller Error: Updating promo code:", error);
    if ((error as Error).message === "NotFound") {
      res.status(404).json({ error: "Promo code not found" });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const deletePromoCodeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await deletePromoCode(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    console.error("Controller Error: Deleting promo code:", error);
    if ((error as Error).message === "NotFound") {
      res.status(404).json({ error: "Promo code not found" });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};
