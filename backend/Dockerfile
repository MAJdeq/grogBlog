FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# CRITICAL — must copy prisma folder into the image
COPY prisma ./prisma

COPY . .

CMD ["npm", "run", "start"]
