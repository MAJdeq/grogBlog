# production image
FROM node:22

# create work dir
WORKDIR /app

# copy dependencies and install
COPY package*.json ./
RUN npm install

# copy rest of app
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]

