-- CreateEnum
CREATE TYPE "LoginMethod" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginMethod" "LoginMethod" NOT NULL DEFAULT 'LOCAL';
