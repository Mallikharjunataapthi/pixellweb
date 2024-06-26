FROM node:18-alpine

WORKDIR /web

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD ["npm","run","dev"]