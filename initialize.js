import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

async function applyMigrations(databaseUrl, schemaPath) {
  console.log(`Using database URL: ${databaseUrl}`);

  try {
    console.log(`Applying migrations...`);
    execSync(`npx prisma migrate reset --force --schema="${schemaPath}"`, {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
    execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
    console.log(`Migrations applied successfully.`);
  } catch (error) {
    console.error(`Error applying migrations:`, error);
  }
}

async function verifyTables(databaseUrl) {
  console.log(`Verifying tables for database URL: ${databaseUrl}`);

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const tables =
      await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`;
    console.log(`Tables in database: ${JSON.stringify(tables, null, 2)}`);
  } catch (error) {
    console.error(`Error fetching tables:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

async function addDefaultCategory(databaseUrl) {
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const existingCategory = await prisma.category.findFirst({
      where: { name: "Uncategorized" },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          name: "Uncategorized",
          description: "Default category for uncategorized products",
        },
      });
      console.log(
        `Default "Uncategorized" category added to database: ${databaseUrl}`
      );
    } else {
      console.log(
        `Default "Uncategorized" category already exists in database: ${databaseUrl}`
      );
    }
  } catch (error) {
    console.error(
      `Error adding default category to database ${databaseUrl}:`,
      error
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function setupDatabase(envFilePath) {
  const envConfig = dotenv.config({ path: envFilePath }).parsed;
  const databaseUrl = envConfig.DATABASE_URL;
  const schemaPath = path.resolve("backend/prisma/schema.prisma");

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is not defined in ${envFilePath}`);
  }

  await applyMigrations(databaseUrl, schemaPath);
  await verifyTables(databaseUrl);
  await addDefaultCategory(databaseUrl);
}

async function setupDevDatabase() {
  const envPath = path.resolve(".env");
  console.log(`Setting up database for development environment: ${envPath}`);
  await setupDatabase(envPath);
}

async function setupTestDatabase() {
  const envPath = path.resolve(".env.test");
  console.log(`Setting up database for test environment: ${envPath}`);
  await setupDatabase(envPath);
}

async function main() {
  await setupDevDatabase();
  await setupTestDatabase();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
