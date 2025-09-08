-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('ELECTRONICS', 'FASHION', 'FOOD', 'BOOKS', 'BEAUTY', 'HOME', 'TOYS', 'SPORTS', 'OTHER', 'Olahraga');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
