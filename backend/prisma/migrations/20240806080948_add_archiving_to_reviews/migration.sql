-- AlterTable
ALTER TABLE "Package" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "quantity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "productName" TEXT,
ADD COLUMN     "variantName" TEXT;
