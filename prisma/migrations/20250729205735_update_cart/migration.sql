/*
  Warnings:

  - Made the column `discount` on table `cart` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
