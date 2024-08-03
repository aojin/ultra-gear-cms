import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resetDatabase = async () => {
  const tableNames = [
    "OrderItem",
    "Order",
    "CartItem",
    "Cart",
    "Review",
    "ProductImage",
    "Size",
    "ProductVariant",
    "Product",
    "SubCategory",
    "Category",
    "User",
    "Inventory",
    "Sale",
    "PromoCode",
    "Package",
  ];

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`
    );
  }
};

export default resetDatabase;
