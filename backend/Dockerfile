FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 8000

FROM base as production
ENV NODE_ENV=production
RUN npm install -g ts-node && npm install
COPY . /src
CMD ["ts-node", "server.ts"]

FROM base as development
ENV NODE_ENV=development
RUN npm install -g ts-node && npm install -g nodemon && npm install
COPY . /src
CMD ["nodemon", "server.ts"]
