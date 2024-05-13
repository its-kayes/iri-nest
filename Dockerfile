FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN yarn 

COPY . .

ENV DB_HOST=127.0.0.1
ENV DB_PORT=5432
ENV DB_USERNAME=kayes
ENV DB_PASSWORD=password
ENV DB_NAME=university_db

EXPOSE 3000

CMD ["yarn", "start"]