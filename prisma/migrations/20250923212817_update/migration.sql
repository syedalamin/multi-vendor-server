/*
  Warnings:

  - You are about to drop the `sellerInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sellerInvoiceItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sellerInvoice" DROP CONSTRAINT "sellerInvoice_orderId_fkey";

-- DropForeignKey
ALTER TABLE "sellerInvoice" DROP CONSTRAINT "sellerInvoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "sellerInvoiceItem" DROP CONSTRAINT "sellerInvoiceItem_sellerInvoiceId_fkey";

-- DropTable
DROP TABLE "sellerInvoice";

-- DropTable
DROP TABLE "sellerInvoiceItem";
