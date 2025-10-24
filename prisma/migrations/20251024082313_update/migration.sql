/*
  Warnings:

  - You are about to drop the column `hours` on the `homePageImages` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `homePageImages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."homePageImages" DROP COLUMN "hours",
DROP COLUMN "minutes";
