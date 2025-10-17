# comands:
# docker build -t dice-betting-app .
# docker run -it dice-betting-app /bin/sh

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]