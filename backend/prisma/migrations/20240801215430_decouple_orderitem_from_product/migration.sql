/*
  Warnings:

  - You are about to drop the column `variantId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "variantId",
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productVariantId" INTEGER,
ADD COLUMN     "productVariantName" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;
