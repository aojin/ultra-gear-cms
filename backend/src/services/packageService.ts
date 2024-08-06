import { PrismaClient, Package } from "@prisma/client";

const prisma = new PrismaClient();

export type CreatePackageInput = {
  name: string;
  description?: string;
  price: number;
  products: number[]; // products should be an array of numbers (product IDs)
};

export type UpdatePackageInput = Partial<CreatePackageInput>;

export const createPackage = async (
  data: CreatePackageInput
): Promise<Package> => {
  return await prisma.package.create({
    data: {
      name: data.name,
      description: data.description || "",
      price: data.price,
      products: {
        connect: data.products.map((productId) => ({ id: productId })),
      },
    },
  });
};

export const getAllPackages = async (): Promise<Package[]> => {
  return await prisma.package.findMany();
};

export const getPackageById = async (id: number): Promise<Package | null> => {
  return await prisma.package.findUnique({ where: { id } });
};

export const updatePackage = async (
  id: number,
  data: UpdatePackageInput
): Promise<Package> => {
  return await prisma.package.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      products: data.products
        ? {
            set: data.products.map((productId) => ({ id: productId })),
          }
        : undefined,
    },
  });
};

export const deletePackage = async (id: number): Promise<void> => {
  await prisma.package.delete({ where: { id } });
};
