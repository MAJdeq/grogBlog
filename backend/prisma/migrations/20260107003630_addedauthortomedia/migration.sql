/*
  Warnings:

  - Added the required column `authorId` to the `MediaReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaReview" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MediaReview" ADD CONSTRAINT "MediaReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
