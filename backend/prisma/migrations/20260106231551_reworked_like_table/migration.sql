/*
  Warnings:

  - You are about to drop the column `blogId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `MediaReview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,itemId,itemType]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemType` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_blogId_fkey";

-- DropIndex
DROP INDEX "Like_userId_blogId_key";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "blogId",
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "itemType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MediaReview" DROP COLUMN "likes";

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_itemId_itemType_key" ON "Like"("userId", "itemId", "itemType");
