# ===========================
# Builder Stage
# ===========================
FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → JS
RUN npm run build

# ===========================
# Production Stage
# ===========================
FROM node:22-alpine
WORKDIR /app

# Copy build, node_modules, and prisma client
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "build/index.js"]
