/*
  Warnings:

  - You are about to drop the column `discount` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart" DROP COLUMN "discount",
ADD COLUMN     "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "discountPercent" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "discountPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;
