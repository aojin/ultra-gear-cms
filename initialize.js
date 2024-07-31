const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

async function columnExists(prisma, tableName, columnName) {
  const result = await prisma.$queryRaw`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name=${tableName} AND column_name=${columnName};
  `;
  return result.length > 0;
}

async function applyMigrations(envPath) {
  dotenv.config({ path: envPath });
  const prisma = new PrismaClient();

  try {
    console.log(`Applying migrations for environment: ${envPath}`);
    execSync(
      `npx prisma migrate reset --force --schema=backend/prisma/schema.prisma`,
      { stdio: "inherit" }
    );
    execSync(
      `npx prisma migrate dev --schema=backend/prisma/schema.prisma --name init`,
      { stdio: "inherit" }
    );
    console.log(`Migrations applied successfully for ${envPath}.`);
  } catch (error) {
    console.error(`Error applying migrations for ${envPath}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

async function setupDatabase(envPath) {
  dotenv.config({ path: envPath });
  const prisma = new PrismaClient();

  try {
    console.log(`Setting up database for environment: ${envPath}`);

    // Ensure the migrations are applied before altering the schema
    await applyMigrations(envPath);

    // Set default values for the new required columns if they don't already exist
    if (!(await columnExists(prisma, "Product", "brand"))) {
      await prisma.$executeRaw`ALTER TABLE "Product" ADD COLUMN "brand" VARCHAR(255) DEFAULT 'Unknown' NOT NULL`;
    }
    if (!(await columnExists(prisma, "Product", "model"))) {
      await prisma.$executeRaw`ALTER TABLE "Product" ADD COLUMN "model" VARCHAR(255) DEFAULT 'Unknown' NOT NULL`;
    }
    if (!(await columnExists(prisma, "Product", "msrpPrice"))) {
      await prisma.$executeRaw`ALTER TABLE "Product" ADD COLUMN "msrpPrice" FLOAT DEFAULT 0 NOT NULL`;
    }

    // Update existing rows to have non-null values
    await prisma.$executeRaw`UPDATE "Product" SET "brand" = 'Unknown' WHERE "brand" IS NULL`;
    await prisma.$executeRaw`UPDATE "Product" SET "model" = 'Unknown' WHERE "model" IS NULL`;
    await prisma.$executeRaw`UPDATE "Product" SET "msrpPrice" = 0 WHERE "msrpPrice" IS NULL`;

    console.log(`Database setup completed successfully for ${envPath}.`);
  } catch (error) {
    console.error(`Error during database setup for ${envPath}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await setupDatabase("backend/.env");
  await setupDatabase("backend/.env.test");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
