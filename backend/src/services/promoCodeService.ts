import { PrismaClient, PromoCode, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type CreatePromoCodeInput = {
  code: string;
  validFrom: Date;
  validTo: Date;
  saleId: number;
};

export type UpdatePromoCodeInput = {
  code?: string;
  validFrom?: Date;
  validTo?: Date;
};

export const createPromoCode = async (
  data: CreatePromoCodeInput
): Promise<PromoCode> => {
  try {
    return await prisma.promoCode.create({
      data: {
        code: data.code,
        validFrom: data.validFrom,
        validTo: data.validTo,
        sale: {
          connect: { id: data.saleId },
        },
      },
    });
  } catch (error) {
    console.error("Service Error: Creating promo code:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create promo code");
    }
  }
};

export const getPromoCodeById = async (
  id: number
): Promise<PromoCode | null> => {
  try {
    return await prisma.promoCode.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Retrieving promo code by ID:", error);
    throw new Error("Service Error: Failed to retrieve promo code by ID");
  }
};

export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  try {
    return await prisma.promoCode.findMany();
  } catch (error) {
    console.error("Service Error: Fetching promo codes:", error);
    throw new Error("Service Error: Failed to fetch promo codes");
  }
};

export const updatePromoCode = async (
  id: number,
  data: UpdatePromoCodeInput
): Promise<PromoCode> => {
  try {
    return await prisma.promoCode.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Service Error: Updating promo code:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update promo code");
    }
  }
};

export const deletePromoCode = async (id: number): Promise<void> => {
  try {
    await prisma.promoCode.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Deleting promo code:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete promo code");
    }
  }
};
