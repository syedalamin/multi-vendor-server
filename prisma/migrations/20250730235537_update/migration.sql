/*
  Warnings:

  - Made the column `contactNumber` on table `Vendor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Vendor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
