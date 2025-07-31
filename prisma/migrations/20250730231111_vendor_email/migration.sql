/*
  Warnings:

  - You are about to drop the column `userId` on the `Vendor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Vendor_userId_key";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "userId";
