/*
  Warnings:

  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "state",
ADD COLUMN     "block" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "subdistrict" TEXT,
ADD COLUMN     "village" TEXT,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL;
