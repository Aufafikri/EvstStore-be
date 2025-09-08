/*
  Warnings:

  - The values [Olahraga] on the enum `CategoryName` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryName_new" AS ENUM ('ELECTRONICS', 'FASHION', 'FOOD', 'BOOKS', 'BEAUTY', 'HOME', 'TOYS', 'SPORTS', 'OTHER');
ALTER TABLE "Category" ALTER COLUMN "name" TYPE "CategoryName_new" USING ("name"::text::"CategoryName_new");
ALTER TYPE "CategoryName" RENAME TO "CategoryName_old";
ALTER TYPE "CategoryName_new" RENAME TO "CategoryName";
DROP TYPE "CategoryName_old";
COMMIT;

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryName" NOT NULL;
