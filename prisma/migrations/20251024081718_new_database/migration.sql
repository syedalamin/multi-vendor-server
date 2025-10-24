-- CreateTable
CREATE TABLE "public"."homePageImages" (
    "id" TEXT NOT NULL DEFAULT 'home_page_single_entry',
    "sliderImages" TEXT[],
    "heroImages" TEXT[],
    "hotDealImages" TEXT[],
    "hotMainImages" TEXT[],
    "reviewImages" TEXT[],
    "reviewMainImages" TEXT[],
    "footerImages" TEXT[],
    "minutes" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,

    CONSTRAINT "homePageImages_pkey" PRIMARY KEY ("id")
);
