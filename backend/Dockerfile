# Production image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Clean install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]
