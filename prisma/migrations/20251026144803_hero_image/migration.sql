-- CreateTable
CREATE TABLE "public"."homePage" (
    "id" TEXT NOT NULL DEFAULT 'home_page',
    "sliderImages" TEXT[],

    CONSTRAINT "homePage_pkey" PRIMARY KEY ("id")
);
