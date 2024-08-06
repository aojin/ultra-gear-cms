import { PrismaClient, Package, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type CreatePackageInput = {
  name: string;
  description?: string;
  price: number;
  products: number[];
};

export type UpdatePackageInput = Partial<CreatePackageInput>;

export const createPackage = async (
  data: CreatePackageInput
): Promise<Package> => {
  try {
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
  } catch (error) {
    console.error("Service: Error creating package:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to create package");
    }
  }
};

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    return await prisma.package.findMany();
  } catch (error) {
    console.error("Service: Error fetching packages:", error);
    throw new Error("Service Error: Failed to fetch packages");
  }
};

export const getPackageById = async (id: number): Promise<Package | null> => {
  try {
    return await prisma.package.findUnique({ where: { id } });
  } catch (error) {
    console.error("Service: Error fetching package by ID:", error);
    throw new Error("Service Error: Failed to fetch package by ID");
  }
};

export const updatePackage = async (
  id: number,
  data: UpdatePackageInput
): Promise<Package> => {
  try {
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
  } catch (error) {
    console.error("Service: Error updating package:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update package");
    }
  }
};

export const deletePackage = async (id: number): Promise<void> => {
  try {
    await prisma.package.delete({ where: { id } });
  } catch (error) {
    console.error("Service: Error deleting package:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete package");
    }
  }
};
