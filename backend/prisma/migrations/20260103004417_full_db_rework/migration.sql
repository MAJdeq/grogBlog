-- 1. Create enum if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
      CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
   END IF;
END
$$;

-- 2. Create User table if not exists
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add authorId column as nullable first
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "authorId" TEXT;

-- 4. Populate authorId for existing rows
INSERT INTO "User" (id, email, password, role, updatedAt)
VALUES ('default-user-id','admin@example.com','hashedpassword','ADMIN', NOW())
ON CONFLICT (id) DO NOTHING;

UPDATE "Blog" SET "authorId" = 'default-user-id';

-- 5. Now make authorId NOT NULL
ALTER TABLE "Blog" ALTER COLUMN "authorId" SET NOT NULL;

-- 6. Add foreign key safely
ALTER TABLE "Blog"
ADD CONSTRAINT IF NOT EXISTS "Blog_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. Drop Admin table safely if exists
DROP TABLE IF EXISTS "Admin";
