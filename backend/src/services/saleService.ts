import { PrismaClient, Sale } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateSaleInput = {
  name: string;
  title: string;
  tagline: string;
  startDate: string | Date;
  endDate: string | Date;
  salePercentage?: number;
  saleAmount?: number;
  archived?: boolean;
  products: number[];
  variants: number[];
  promoCodes: number[];
};

export type UpdateSaleInput = Partial<CreateSaleInput>;

export const createSale = async (data: CreateSaleInput): Promise<Sale> => {
  return await prisma.sale.create({
    data: {
      name: data.name,
      title: data.title,
      tagline: data.tagline,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      salePercentage: data.salePercentage,
      saleAmount: data.saleAmount,
      archived: data.archived,
      products: {
        connect: data.products.map((productId) => ({ id: productId })),
      },
      variants: {
        connect: data.variants.map((variantId) => ({ id: variantId })),
      },
      promoCodes: {
        connect: data.promoCodes.map((promoCodeId) => ({ id: promoCodeId })),
      },
    },
  });
};

export const getAllSales = async (): Promise<Sale[]> => {
  return await prisma.sale.findMany({
    include: {
      products: true,
      variants: true,
      promoCodes: true,
    },
  });
};

export const getSaleById = async (id: number): Promise<Sale | null> => {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      products: true,
      variants: true,
      promoCodes: true,
    },
  });
};

export const updateSale = async (
  id: number,
  data: UpdateSaleInput
): Promise<Sale> => {
  return await prisma.sale.update({
    where: { id },
    data: {
      name: data.name,
      title: data.title,
      tagline: data.tagline,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      salePercentage: data.salePercentage,
      saleAmount: data.saleAmount,
      archived: data.archived,
      products: data.products
        ? {
            set: data.products.map((productId) => ({ id: productId })),
          }
        : undefined,
      variants: data.variants
        ? {
            set: data.variants.map((variantId) => ({ id: variantId })),
          }
        : undefined,
      promoCodes: data.promoCodes
        ? {
            set: data.promoCodes.map((promoCodeId) => ({ id: promoCodeId })),
          }
        : undefined,
    },
  });
};

export const deleteSale = async (id: number): Promise<void> => {
  await prisma.sale.delete({
    where: { id },
  });
};

export const archiveSale = async (id: number): Promise<Sale> => {
  return await prisma.sale.update({
    where: { id },
    data: { archived: true },
  });
};

export const unarchiveSale = async (id: number): Promise<Sale> => {
  return await prisma.sale.update({
    where: { id },
    data: { archived: false },
  });
};
