import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const globalTeardown = async () => {
  await prisma.$disconnect();
};

export default globalTeardown;
