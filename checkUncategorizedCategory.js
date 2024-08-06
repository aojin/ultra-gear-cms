import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

async function checkCategory(databaseUrl, categoryName = "Uncategorized") {
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (category) {
      console.log(
        `Category "${categoryName}" exists in database: ${databaseUrl}`
      );
    } else {
      console.log(
        `Category "${categoryName}" does NOT exist in database: ${databaseUrl}`
      );
    }
  } catch (error) {
    console.error(
      `Error checking category "${categoryName}" in database ${databaseUrl}:`,
      error
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function checkDevDatabase() {
  const envPath = path.resolve(".env");
  dotenv.config({ path: envPath });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is not defined in ${envPath}`);
  }

  await checkCategory(databaseUrl);
}

async function checkTestDatabase() {
  const envPath = path.resolve(".env.test");
  dotenv.config({ path: envPath });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is not defined in ${envPath}`);
  }

  await checkCategory(databaseUrl);
}

async function main() {
  await checkDevDatabase();
  await checkTestDatabase();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
