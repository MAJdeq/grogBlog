# ===========================
# 1. Builder Stage
# ===========================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy everything, including prisma
COPY . .

# Generate prisma client
RUN npx prisma generate

# Build TypeScript → JavaScript (this creates /app/build)
RUN npm run build


# ===========================
# 2. Production Stage
# ===========================
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy prisma schema (needed at runtime)
COPY prisma ./prisma

# Copy compiled JavaScript (from /app/build)
COPY --from=builder /app/build ./build

# Start app using compiled JS
CMD ["node", "build/index.js"]
