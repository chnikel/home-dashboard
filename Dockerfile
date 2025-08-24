FROM node:24.6

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000


WORKDIR /app/server

RUN npm install

CMD [ "node", "server.js" ]