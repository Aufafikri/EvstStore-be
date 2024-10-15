/*
  Warnings:

  - You are about to drop the column `block` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "block",
DROP COLUMN "neighborhood",
DROP COLUMN "village",
ADD COLUMN     "district" TEXT;
