/*
  Warnings:

  - Added the required column `productImages` to the `invoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `orderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoiceItem" ADD COLUMN     "productImages" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItem" ADD COLUMN     "productImage" TEXT NOT NULL;
