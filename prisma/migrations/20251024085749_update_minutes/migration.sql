-- AlterTable
ALTER TABLE "public"."homePageImages" ADD COLUMN     "hours" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "minutes" DECIMAL(65,30) NOT NULL DEFAULT 0;
