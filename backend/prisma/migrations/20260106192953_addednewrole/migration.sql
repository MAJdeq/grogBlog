-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AUTHOR';

-- AlterTable
ALTER TABLE "MediaReview" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
