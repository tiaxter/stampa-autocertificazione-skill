FROM node:latest AS base

RUN apt-get -y update && apt-get -y install ghostscript graphicsmagick
RUN npm i nodemon cross-env typescript ts-node -g

WORKDIR /app
COPY . .

WORKDIR /app/lambda
COPY ./lambda/package*.json ./
RUN npm ci
EXPOSE 3000

FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app/lambda
CMD ["nodemon"]

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app/lambda
RUN tsc --project tsconfig.json
CMD ["npm", "start"]
