/*
  Warnings:

  - Made the column `discount` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "averageRating" SET DEFAULT 0;
