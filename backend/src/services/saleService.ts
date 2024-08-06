import { PrismaClient, Sale, Prisma } from "@prisma/client";

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
  try {
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
  } catch (error) {
    console.error("Service Error: Creating sale:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to create sale");
    }
  }
};

export const getAllSales = async (): Promise<Sale[]> => {
  try {
    return await prisma.sale.findMany({
      include: {
        products: true,
        variants: true,
        promoCodes: true,
      },
    });
  } catch (error) {
    console.error("Service Error: Fetching all sales:", error);
    throw new Error("Service Error: Failed to fetch all sales");
  }
};

export const getSaleById = async (id: number): Promise<Sale | null> => {
  try {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        products: true,
        variants: true,
        promoCodes: true,
      },
    });
  } catch (error) {
    console.error("Service Error: Fetching sale by ID:", error);
    throw new Error("Service Error: Failed to fetch sale by ID");
  }
};

export const updateSale = async (
  id: number,
  data: UpdateSaleInput
): Promise<Sale> => {
  try {
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
  } catch (error) {
    console.error("Service Error: Updating sale:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to update sale");
    }
  }
};

export const deleteSale = async (id: number): Promise<void> => {
  try {
    await prisma.sale.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Deleting sale:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to delete sale");
    }
  }
};

export const archiveSale = async (id: number): Promise<Sale> => {
  try {
    return await prisma.sale.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service Error: Archiving sale:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to archive sale");
    }
  }
};

export const unarchiveSale = async (id: number): Promise<Sale> => {
  try {
    return await prisma.sale.update({
      where: { id },
      data: { archived: false },
    });
  } catch (error) {
    console.error("Service Error: Unarchiving sale:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to unarchive sale");
    }
  }
};
