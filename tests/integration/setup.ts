import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env.test" });

const prisma = new PrismaClient();

export default async () => {
  await prisma.$connect();
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
};
