const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

async function applyMigrations(envFilePath) {
  const envConfig = dotenv.config({ path: envFilePath }).parsed;

  const databaseUrl = envConfig.DATABASE_URL;

  console.log(`Using database URL from ${envFilePath}: ${databaseUrl}`);

  try {
    console.log(`Applying migrations for environment: ${envFilePath}`);
    execSync(
      `npx prisma migrate reset --force --schema=backend/prisma/schema.prisma`,
      {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: databaseUrl },
      }
    );
    execSync(
      `npx prisma migrate deploy --schema=backend/prisma/schema.prisma`,
      {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: databaseUrl },
      }
    );
    console.log(`Migrations applied successfully for ${envFilePath}.`);
  } catch (error) {
    console.error(`Error applying migrations for ${envFilePath}:`, error);
  }
}

async function verifyTables(envFilePath) {
  const envConfig = dotenv.config({ path: envFilePath }).parsed;

  const databaseUrl = envConfig.DATABASE_URL;

  console.log(`Verifying tables for database URL: ${databaseUrl}`);

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const tables =
      await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`;
    console.log(
      `Tables in database for ${envFilePath}: ${JSON.stringify(
        tables,
        null,
        2
      )}`
    );
  } catch (error) {
    console.error(`Error fetching tables for ${envFilePath}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

async function setupDatabase(envFilePath) {
  await applyMigrations(envFilePath);
  await verifyTables(envFilePath);
}

async function main() {
  const envPaths = [
    path.resolve(__dirname, "backend/.env"),
    path.resolve(__dirname, "backend/.env.test"),
  ];

  for (const envPath of envPaths) {
    console.log(`Setting up database for environment: ${envPath}`);
    dotenv.config({ path: envPath });
    console.log(`Loaded DATABASE_URL: ${process.env.DATABASE_URL}`);
    await setupDatabase(envPath);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
