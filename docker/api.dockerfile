FROM node:20.18.0-slim

WORKDIR /api

COPY . .

ENV NPM_CONFIG_CACHE=/home/node/.npm

RUN npm install

USER node

CMD ["npm", "run", "dev"]