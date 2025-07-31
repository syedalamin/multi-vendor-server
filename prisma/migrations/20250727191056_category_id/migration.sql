/*
  Warnings:

  - Added the required column `categoryId` to the `subCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subCategory" DROP CONSTRAINT "subCategory_id_fkey";

-- AlterTable
ALTER TABLE "subCategory" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "subCategory" ADD CONSTRAINT "subCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
