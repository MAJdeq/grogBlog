# Frontend build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Only copy package files first
COPY package*.json ./

# Clean install dependencies
RUN npm ci --legacy-peer-deps --verbose

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Production stage
FROM nginx:1.29.3
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
