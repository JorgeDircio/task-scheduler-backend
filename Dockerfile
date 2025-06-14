FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./

ENV NODE_ENV=development
RUN npm install

COPY tsconfig.json ./
COPY src/ src/

EXPOSE 3000

CMD ["npm", "run", "dev"]
