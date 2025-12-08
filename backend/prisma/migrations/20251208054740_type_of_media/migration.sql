/*
  Warnings:

  - You are about to drop the `MovieReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MovieReview";

-- CreateTable
CREATE TABLE "MediaReview" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaReview_pkey" PRIMARY KEY ("id")
);
