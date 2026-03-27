/*
  Warnings:

  - You are about to drop the `homePage` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "homePageImages" ADD COLUMN     "facebook" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "headSlider" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instagram" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phonNumber" TEXT,
ADD COLUMN     "twitter" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "youtube" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "homePage";
