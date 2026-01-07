/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
-- 1. Create enum "Role" if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
      CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
   END IF;
END
$$;

-- 2. Create User table if it doesn't exist
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add authorId column to Blog as nullable
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "authorId" TEXT;

-- 4. Add foreign key to authorId (nullable columns are allowed)
ALTER TABLE "Blog"
ADD CONSTRAINT IF NOT EXISTS "Blog_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. Drop Admin table safely if it exists
DROP TABLE IF EXISTS "Admin";
