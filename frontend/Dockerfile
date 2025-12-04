# builder
FROM node:22 as builder

# set up working dir
WORKDIR /app

# copy and install dependencies
COPY package*json ./
RUN npm install

# copy rest of project
COPY . .

# build
RUN npm run build

# production image
FROM nginx:1.29.3

# copy build to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

#expose nginx
EXPOSE 80