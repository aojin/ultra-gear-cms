/*
  Warnings:

  - Made the column `quantity` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "quantity" SET NOT NULL;

-- AlterTable
ALTER TABLE "Size" ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "updatedAt" DROP DEFAULT;
