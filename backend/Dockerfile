# Backend build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only dependency files
COPY package*.json ./
RUN npm ci

# Copy all code
COPY . .

# Build backend (if using TypeScript or bundler)
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Copy built app & node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 5000
CMD ["npm", "run", "start"]
