FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ src/

EXPOSE 3000

CMD ["npm", "run", "dev"]
