/*
  Warnings:

  - You are about to drop the column `productImages` on the `invoiceItem` table. All the data in the column will be lost.
  - Added the required column `productImage` to the `invoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoiceItem" DROP COLUMN "productImages",
ADD COLUMN     "productImage" TEXT NOT NULL;
