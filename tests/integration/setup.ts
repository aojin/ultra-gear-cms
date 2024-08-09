import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const globalSetup = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "OrderItem" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "PromoCode" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Review" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductVariant" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Sale" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductImage" CASCADE`;
};

export default globalSetup;
