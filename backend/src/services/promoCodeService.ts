import { PrismaClient, PromoCode } from "@prisma/client";

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
};

export const getPromoCodeById = async (
  id: number
): Promise<PromoCode | null> => {
  return await prisma.promoCode.findUnique({
    where: { id },
  });
};

export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  return await prisma.promoCode.findMany();
};

export const updatePromoCode = async (
  id: number,
  data: UpdatePromoCodeInput
): Promise<PromoCode> => {
  return await prisma.promoCode.update({
    where: { id },
    data,
  });
};

export const deletePromoCode = async (id: number): Promise<void> => {
  await prisma.promoCode.delete({
    where: { id },
  });
};
