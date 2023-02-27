FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . ./

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "./build/index.js"]