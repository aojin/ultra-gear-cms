import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {
  const tables = [
    "Category",
    "Product",
    "ProductVariant",
    "ProductImage",
    "Size",
    "User",
    "OrderItem",
    "Order",
    "Review",
    "Cart",
    "CartItem",
    "Inventory",
    "Sale",
    "PromoCode",
    "Package",
  ];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
    );
  }
  await prisma.$disconnect();
};
