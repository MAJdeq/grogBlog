# ===========================
# 1. Builder Stage
# ===========================
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ===========================
# 2. Runtime Image
# ===========================
FROM node:22
WORKDIR /app

# Copy node_modules (including Prisma Client)
COPY --from=builder /app/node_modules ./node_modules

# Copy build output
COPY --from=builder /app/build ./build

COPY --from=builder /app/src ./src

# Copy Prisma schema & migrations
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copy package.json for metadata
COPY package*.json ./

<<<<<<< HEAD
CMD ["sh", "-c", "npx prisma migrate reset && npx prisma migrate deploy && npm run seed_admin && node build/index.js"]
=======
CMD ["node", "build/index.js"]

>>>>>>> 24867770cd34d8d11bbb86bf3733e0c5861e7b3e
