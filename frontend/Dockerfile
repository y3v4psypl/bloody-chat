FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000

FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . /src
CMD ["npm", "run", "dev"]