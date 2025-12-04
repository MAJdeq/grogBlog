# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL 
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy build output
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Run serve
CMD ["serve", "-s", "dist", "-l", "5000"]
